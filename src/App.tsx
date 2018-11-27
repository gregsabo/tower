import autobind from "autobind-decorator";
import * as React from "react";
import "./App.css";
import { Input } from "./Input";
import BrickNamer from "./BrickNamer";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import InputConfiguration from "./InputConfiguration";
import { Invocation } from "./Invocation";
import KeyboardController from "./KeyboardController";
import Library from "./Library";
import * as Modules from "./Modules";
import Program from "./Program";
import { Socket } from "./Socket";
import TestGrid from "./TestGrid";
import UndoManager from "./UndoManager";
import {
  ITest,
  IModules,
  LibraryKey,
  UniqueId,
  EditorMode,
  IInputConfiguration
} from "./Types";
import { Sky } from "./Sky";
import SkyComponent from "./SkyComponent";
import { Brick } from "./Brick";
import { deserializeModules } from "./Deserialization";

const CAPITALIZE_SENTENCE = new Invocation({
  inputs: {
    a: new Invocation({
      inputs: {
        a: new Invocation({
          implementationKey: "split",
          inputs: { a: new Input() }
        }),
        b: new Invocation({
          implementationKey: "capitalize",
          inputs: { a: new Cork() }
        })
      },
      implementationKey: "map"
    }),
    b: new Constant({ value: " " })
  },
  implementationKey: "join"
});

interface IState {
  highlightedLibraryItemId: string;
  canCursorId: string;
  editorMode: EditorMode;
  inputs: InputConfiguration[];
  library: any;
  modules: IModules;
  currentModuleId: string;
  currentBrickId: string;
  sky: Sky;
}
const log = console.log;

class App extends React.Component<{}, IState> {
  public undoManager: UndoManager;

  public componentDidMount() {
    const keyboardController = new KeyboardController(this);
    keyboardController.registerKeyEvents();
    this.undoManager = new UndoManager(10);
    let modules = {
      basic: {
        name: "Starter Module",
        towers: {
          sentence_cap: {
            brickKey: "sentence_cap",
            moduleKey: "basic",
            name: "Sentence Capitalization",
            inputs: [{ key: "a", displayName: "sentence" }],
            rootBrick: CAPITALIZE_SENTENCE,
            tests: []
          }
        }
      }
    };

    if (window.localStorage.modules) {
      modules = deserializeModules(JSON.parse(window.localStorage.modules));
    }

    Modules.importModulesIntoLibrary(modules, Library);

    this.setState({
      canCursorId: CAPITALIZE_SENTENCE.uniqueId,
      currentBrickId: "sentence_cap",
      currentModuleId: "basic",
      editorMode: "cursor",
      highlightedLibraryItemId: "string",
      inputs: [new InputConfiguration(0)],
      library: Library,
      modules,
      sky: new Sky()
    });

    this.undoManager.remember(modules);

    keyboardController.history.remember("basic", "sentence_cap");
  }

  public render() {
    // const highlight = this.highlightLibraryItem.bind(this);
    if (this.state === null) {
      return null;
    }
    return (
      <div className="App" style={{ display: "flex" }}>
        <div>
          <BrickNamer
            editorMode={this.state.editorMode}
            name={this.currentTower().name}
            onBrickNameChange={this.onBrickNameChange}
          />
          {this.state.editorMode === "test" ? (
            <TestGrid
              brick={this.currentTower()}
              modules={this.state.modules}
              library={this.state.library}
              onTestsChanged={this.onTestsChanged}
            />
          ) : (
            <div>
              <SkyComponent
                contents={this.state.sky.peek()}
                editorMode={this.state.editorMode}
                library={this.state.library}
                modules={this.state.modules}
              />
              <Program
                contents={this.currentTower()}
                editorMode={this.state.editorMode}
                library={this.state.library}
                modules={this.state.modules}
                onCanInserted={this.onCanInserted}
                canCursorId={this.state.canCursorId}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  public currentTower() {
    return Modules.getTowerFromModules(
      this.state.currentModuleId,
      this.state.currentBrickId,
      this.state.modules
    );
  }

  @autobind
  public onBrickNameChange(newName: string) {
    this.currentTower().name = newName;
    this.setState({});
  }

  @autobind
  public onTestsChanged(tests: ITest[]) {
    this.currentTower().tests = tests;
    this.modulesChanged();
  }

  public highlightLibraryItem(libraryItemId: LibraryKey) {
    this.setState({ highlightedLibraryItemId: libraryItemId });
  }

  public invocationForLibraryItemId(itemId: string) {
    if (itemId === "newBrick") {
      itemId = Modules.createNewTower(
        this.state.currentModuleId,
        this.state.modules
      );
      Modules.importModulesIntoLibrary(this.state.modules, this.state.library);
    }
    const libraryItem = Modules.maybeLookUpModule(
      this.state.library[itemId],
      this.state.modules
    );

    if (libraryItem.invocationGenerator) {
      return libraryItem.invocationGenerator();
    }
    const inputs = {};
    libraryItem.inputs.forEach((inputConfig: IInputConfiguration) => {
      inputs[inputConfig.key] = new Socket();
    });
    return new Invocation({
      implementationKey: itemId,
      inputs
    });
  }

  public modulesChanged() {
    this.setState({});
    this.undoManager.remember(this.state.modules);
    window.localStorage.modules = JSON.stringify(this.state.modules);
  }

  public undo() {
    if (this.undoManager.undoAble()) {
      this.setState({
        modules: this.undoManager.undo()
      });
    }
  }

  public redo() {
    if (this.undoManager.redoAble()) {
      this.setState({
        modules: this.undoManager.redo()
      });
    }
  }

  @autobind
  public onInputsChanged(inputs: InputConfiguration[]) {
    this.setState({ inputs });
  }

  @autobind
  public onCanInserted(canId: UniqueId, selectedLibraryItem: LibraryKey) {
    const invocation = this.invocationForLibraryItemId(selectedLibraryItem);
    const rootBrick = this.currentTower().rootBrick;
    if (rootBrick.uniqueId === canId) {
      // it's the root, replace it.
      this.currentTower().rootBrick = invocation;
      this.setState({
        canCursorId: invocation.uniqueId,
        editorMode: "cursor"
      });
      return this.modulesChanged();
    }
    this.recurseFindAndReplaceById(
      this.currentTower().rootBrick,
      canId,
      invocation
    );
    this.setState({
      canCursorId: invocation.uniqueId,
      editorMode: "cursor"
    });
    this.modulesChanged();
  }

  public recurseFindAndReplaceById(
    program: Brick,
    needle: UniqueId,
    invocation: Invocation
  ) {
    if (!(program instanceof Invocation)) {
      return false;
    }
    for (const key in program.inputs) {
      if (!program.inputs.hasOwnProperty(key)) {
        continue;
      }
      if (program.inputs[key].uniqueId === needle) {
        log("Replacing", program, key, invocation);
        program.inputs[key] = invocation;
        return true;
      }
      this.recurseFindAndReplaceById(program.inputs[key], needle, invocation);
    }
    return false;
  }

  public recurseFindAndReplace(
    program: Brick,
    needle: Brick,
    invocation: Brick
  ) {
    if (!(program instanceof Invocation)) {
      return false;
    }
    for (const key in program.inputs) {
      if (!program.inputs.hasOwnProperty(key)) {
        continue;
      }
      if (program.inputs[key].uniqueId === needle.uniqueId) {
        log("Replacing", program, key, invocation);
        program.inputs[key] = invocation;
        return true;
      }
      this.recurseFindAndReplace(program.inputs[key], needle, invocation);
    }
    return false;
  }
}

export default App;

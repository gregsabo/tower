import autobind from "autobind-decorator";
import * as React from "react";
import "./App.css";
import Arg from "./Arg";
import BrickNamer from "./BrickNamer";
import Constant from "./Constant";
import Cork from "./Cork";
import InputConfiguration from "./InputConfiguration";
import Invocation from "./Invocation";
import KeyboardController from "./KeyboardController";
import Library from "./Library";
import * as Modules from "./Modules";
import Program from "./Program";
import Socket from "./Socket";
import TestGrid from "./TestGrid";
import UndoManager from "./UndoManager";
import {
  ITest,
  ILibrary,
  IModules,
  LibraryKey,
  ISocket,
  IInvocation,
  UniqueId,
  EditorMode
} from "./Types";
import { Sky } from "./Sky";
import SkyComponent from "./SkyComponent";

const CAPITALIZE_SENTENCE = Invocation.create({
  args: [
    Invocation.create({
      args: [
        Invocation.create({
          args: [Arg.create({})],
          implementationKey: "split"
        }),
        Invocation.create({
          args: [Cork.create({})],
          implementationKey: "capitalize"
        })
      ],
      implementationKey: "map"
    }),
    Constant.create({ value: " " })
  ],
  implementationKey: "join"
});

interface IState {
  highlightedLibraryItemId: string;
  canCursorId: string;
  editorMode: EditorMode;
  inputs: InputConfiguration[];
  library: ILibrary;
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
        bricks: {
          sentence_cap: {
            brickKey: "sentence_cap",
            moduleKey: "basic",
            name: "Sentence Capitalization",
            numArgs: 1,
            rootInvocation: CAPITALIZE_SENTENCE,
            tests: []
          }
        },
        name: "Starter Module"
      }
    };

    if (window.localStorage.modules) {
      modules = JSON.parse(window.localStorage.modules);
    }

    Modules.importModulesIntoLibrary(modules, Library);
    log("Library is now", Library);

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
            name={this.currentBrick().name}
            onBrickNameChange={this.onBrickNameChange}
          />
          {this.state.editorMode === "test" ? (
            <TestGrid
              brick={this.currentBrick()}
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
                contents={this.currentBrick()}
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

  public currentBrick() {
    return Modules.getBrickFromModules(
      this.state.currentModuleId,
      this.state.currentBrickId,
      this.state.modules
    );
  }

  @autobind
  public onBrickNameChange(newName: string) {
    this.currentBrick().name = newName;
    this.setState({});
  }

  @autobind
  public onTestsChanged(tests: ITest[]) {
    this.currentBrick().tests = tests;
    this.modulesChanged();
  }

  public highlightLibraryItem(libraryItemId: LibraryKey) {
    this.setState({ highlightedLibraryItemId: libraryItemId });
  }

  public invocationForLibraryItemId(itemId: string) {
    if (itemId === "newBrick") {
      itemId = Modules.createNewBrick(
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
    const args = [];
    for (let i = 0; i < libraryItem.numArgs; i++) {
      args.push(Socket.create({}));
    }
    return Invocation.create({
      args,
      implementationKey: itemId
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
    const rootInvocation = this.currentBrick().rootInvocation;
    if (rootInvocation.uniqueId === canId) {
      // it's the root, replace it.
      this.currentBrick().rootInvocation = invocation;
      this.setState({
        canCursorId: invocation.uniqueId,
        editorMode: "cursor"
      });
      return this.modulesChanged();
    }
    this.recurseFindAndReplaceById(
      this.currentBrick().rootInvocation,
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
    program: IInvocation,
    needle: UniqueId,
    invocation: IInvocation
  ) {
    if (program.args === undefined) {
      return false;
    }
    for (let i = 0; i < program.args.length; i++) {
      if (program.args[i].uniqueId === needle) {
        log("Replacing", program, i, invocation);
        program.args[i] = invocation;
        return true;
      }
      this.recurseFindAndReplaceById(program.args[i], needle, invocation);
    }
    return false;
  }

  public recurseFindAndReplace(
    program: IInvocation,
    needle: IInvocation | ISocket,
    invocation: IInvocation
  ) {
    if (program.args === undefined) {
      return false;
    }
    for (let i = 0; i < program.args.length; i++) {
      if (program.args[i].uniqueId === needle.uniqueId) {
        log("Replacing", program, i, invocation);
        program.args[i] = invocation;
        return true;
      }
      this.recurseFindAndReplace(program.args[i], needle, invocation);
    }
    return false;
  }
}

export default App;

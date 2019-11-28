import autobind from "autobind-decorator";
import * as React from "react";
import "./App.css";
import { Input } from "./Input";
import BrickNamer from "./BrickNamer";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import { Invocation } from "./Invocation";
import KeyboardController from "./KeyboardController";
import Library from "./Library";
import * as Modules from "./Modules";
import Program from "./Program";
import TestGrid from "./TestGrid";
import UndoManager from "./UndoManager";
import {
  ITest,
  IModules,
  LibraryKey,
  EditorMode,
  IParameterEditingState
} from "./Types";
import { Sky } from "./Sky";
import SkyComponent from "./SkyComponent";
import { Brick } from "./Brick";
import { deserializeModules } from "./Deserialization";
import ParameterPane from "./ParameterPane";
import TowerPath from "./TowerPath";


const CAPITALIZE_SENTENCE = new Invocation({
  inputs: {
    a: new Invocation({
      inputs: {
        a: new Invocation({
          implementationKey: "split",
          inputs: { a: new Input({ inputKey: "a" }) }
        }),
        func: new Invocation({
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
  cursorPath: TowerPath;
  editorMode: EditorMode;
  library: any;
  modules: IModules;
  currentModuleKey: string;
  currentTowerKey: string;
  sky: Sky;
  parameterEditingState: IParameterEditingState;
}

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
            towerKey: "sentence_cap",
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
      cursorPath: TowerPath.forRoot(),
      currentTowerKey: "sentence_cap",
      currentModuleKey: "basic",
      editorMode: "cursor",
      highlightedLibraryItemId: "string",
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
              {this.state.editorMode === "parameter" ? (
                <ParameterPane
                  parameters={this.currentTower().inputs}
                  parameterEditingState={this.state.parameterEditingState}
                  onNameChange={this.onParameterNameChange}
                />
              ) : null}
              <SkyComponent
                contents={this.state.sky.peek()}
                editorMode={this.state.editorMode}
                library={this.state.library}
                modules={this.state.modules}
                currentModuleKey={this.state.currentModuleKey}
                currentTowerKey={this.state.currentTowerKey}
              />
              <Program
                contents={this.currentTower()}
                editorMode={this.state.editorMode}
                library={this.state.library}
                modules={this.state.modules}
                onCanInserted={this.insertLibraryItemAtPath}
                cursorPath={this.state.cursorPath}
                currentModuleKey={this.state.currentModuleKey}
                currentTowerKey={this.state.currentTowerKey}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  public currentTower() {
    return Modules.getTowerFromModules(
      this.state.currentModuleKey,
      this.state.currentTowerKey,
      this.state.modules
    );
  }

  @autobind
  public onBrickNameChange(newName: string) {
    this.currentTower().name = newName;
    this.setState({});
    this.modulesChanged();
  }

  @autobind
  public onTestsChanged(tests: ITest[]) {
    this.currentTower().tests = tests;
    this.modulesChanged();
  }

  @autobind
  public onParameterNameChange(num: number, newName: string) {
    const parameter = this.currentTower().inputs[num];
    parameter.displayName = newName;
    this.modulesChanged();
  }

  public highlightLibraryItem(libraryItemId: LibraryKey) {
    this.setState({ highlightedLibraryItemId: libraryItemId });
  }

  public invocationForLibraryItemId(itemId: string) {
    if (itemId === "newBrick") {
      itemId = Modules.createNewTower(
        this.state.currentModuleKey,
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
    return new Invocation({
      implementationKey: itemId,
      inputs: {}
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
  public insertLibraryItemAtPath(
    path: TowerPath,
    selectedLibraryItem: LibraryKey
  ) {
    const invocation = this.invocationForLibraryItemId(selectedLibraryItem);
    this.replaceBrickAtPath(path, invocation);
  }

  public replaceBrickAtPath(path: TowerPath, brick: Brick) {
    path.replace(this.currentTower(), brick);
    this.setState({
      cursorPath: path,
      editorMode: "cursor"
    });
    this.modulesChanged();
  }
}

export default App;

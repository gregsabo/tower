import { Invocation } from "./Invocation";
import History from "./History";
import App from "./App";
import { copyTowerObject } from "./CopyTowerObject";
import * as ParameterKeyboardController from "./ParameterKeyboardController";
import TowerPath from "./TowerPath";

export default class KeyboardController {
  public history: History;
  private app: App;

  constructor(app: App) {
    this.app = app;
    this.history = new History();
  }

  public registerKeyEvents() {
    document.addEventListener("keydown", e => {
      this.onKeyDown(e);
      return true;
    });
  }

  public moveCursorPathUp() {
    const path = this.app.state.cursorPath;
    const brick = path.get(this.app.currentTower());
    if (brick instanceof Invocation) {
      const inputConfigs = brick.getInputConfiguration(
        this.app.state.library,
        this.app.state.modules
      );
      if (inputConfigs.length === 0) {
        return path;
      } else {
        return path.plus(inputConfigs[0].key);
      }
    } else {
      return path;
    }
  }

  public moveCursorPathDown() {
    return this.app.state.cursorPath.parent();
  }

  public moveCursorPathLeft() {
    const path = this.app.state.cursorPath;
    const parent = path.parent().get(this.app.currentTower()) as Invocation;
    const inputConfigs = parent.getInputConfiguration(
      this.app.state.library,
      this.app.state.modules
    );
    const indexOfInput = inputConfigs.findIndex(
      config => config.key === path.finalComponent()
    );
    if (indexOfInput === 0) {
      return path.parent();
    } else {
      return path.parent().plus(inputConfigs[indexOfInput - 1].key);
    }
  }

  public moveCursorPathRight() {
    const path = this.app.state.cursorPath;
    const parent = path.parent().get(this.app.currentTower()) as Invocation;
    const inputConfigs = parent.getInputConfiguration(
      this.app.state.library,
      this.app.state.modules
    );
    const indexOfInput = inputConfigs.findIndex(
      config => config.key === path.finalComponent()
    );
    if (indexOfInput + 1 >= inputConfigs.length) {
      return path.parent();
    } else {
      return path.parent().plus(inputConfigs[indexOfInput + 1].key);
    }
  }

  public moveCursorTo(path: TowerPath) {
    this.app.setState({ cursorPath: path });
  }

  public enterInsertMode() {
    this.app.setState({
      editorMode: "insert"
    });
  }

  public enterCursorMode() {
    ParameterKeyboardController.deactivate(this.app);
    this.app.setState({
      editorMode: "cursor"
    });
  }

  public deleteSelectedCan() {
    this.app.state.cursorPath.delete(this.app.currentTower());
    this.app.setState({
      editorMode: "cursor"
    });
    this.app.modulesChanged();
  }

  public keyOf(inObject: any, value: any) {
    for (const key in inObject) {
      if (!inObject.hasOwnProperty(key)) {
        continue;
      }
      if (inObject[key] === value) {
        return key;
      }
    }
    return null;
  }

  public visitSelectedBrick() {
    const brick = this.app.state.cursorPath.get(this.app.currentTower());
    if (!(brick instanceof Invocation)) {
      return;
    }
    const tower = brick.libraryFunction(
      this.app.state.library,
      this.app.state.modules
    );
    if (!tower.towerKey || !tower.moduleKey) {
      return;
    }
    console.log("Got module", brick, "key", tower.moduleKey);
    this.app.setState({
      currentTowerKey: tower.towerKey,
      currentModuleKey: tower.moduleKey,
      cursorPath: TowerPath.forRoot()
    });
    this.history.remember(tower.moduleKey, tower.towerKey);
  }

  public goBack() {
    const current = this.history.goBack();
    console.log("going back", current);
    this.app.setState({
      currentTowerKey: current.towerKey,
      currentModuleKey: current.moduleKey,
      cursorPath: TowerPath.forRoot()
    });
  }

  public goForwards() {
    const current = this.history.goForwards();
    console.log("going forwards", current);
    this.app.setState({
      currentTowerKey: current.towerKey,
      currentModuleKey: current.moduleKey,
      cursorPath: TowerPath.forRoot()
    });
  }

  public editConstant() {
    this.app.setState({
      editorMode: "constant"
    });
  }

  public goToTestMode() {
    this.app.setState({
      editorMode: "test"
    });
  }

  public renameBrick() {
    this.app.setState({
      editorMode: "naming"
    });
  }

  public copyToSky() {
    const brick = this.app.state.cursorPath.get(this.app.currentTower());
    this.app.state.sky.moveIn(copyTowerObject(brick));
    this.app.setState({});
  }

  public copyFromSky() {
    const skyItem = this.app.state.sky.peek();
    if (skyItem === null) {
      console.log("Nothing in the sky to copy.");
      return;
    }
    this.app.state.cursorPath.replace(
      this.app.currentTower(),
      copyTowerObject(skyItem)
    );
    this.app.modulesChanged();
  }

  public clearSky() {
    this.app.state.sky.clear();
    this.app.setState({});
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.metaKey) {
      // Don't interfere with browser shortcuts
      return true;
    }
    if (e.code === "Escape") {
      this.enterCursorMode();
    }
    if (ParameterKeyboardController.isActive(this.app)) {
      return ParameterKeyboardController.dispatch(e, this.app);
    }
    if (this.app.state.editorMode !== "cursor") {
      return true;
    }
    // if (e.target !== window.document.body) {
    //     return true;
    // }
    switch (e.code) {
      case "KeyU":
        this.app.undo();
        break;
      case "KeyY":
        this.app.redo();
        break;
      case "KeyA":
        ParameterKeyboardController.activate(this.app);
        break;
      case "KeyI":
        this.enterInsertMode();
        break;
      case "KeyD":
        this.deleteSelectedCan();
        break;
      case "KeyM":
        this.visitSelectedBrick();
        break;
      case "KeyE":
        this.goBack();
        break;
      case "KeyR":
        this.goForwards();
        break;
      case "KeyT":
        this.goToTestMode();
        break;
      case "KeyN":
        this.renameBrick();
        break;
      case "KeyO":
        this.editConstant();
        break;
      case "KeyJ":
        this.moveCursorTo(this.moveCursorPathDown());
        break;
      case "KeyK":
        this.moveCursorTo(this.moveCursorPathUp());
        break;
      case "KeyH":
        this.moveCursorTo(this.moveCursorPathLeft());
        break;
      case "KeyL":
        this.moveCursorTo(this.moveCursorPathRight());
        break;
      case "KeyC":
        this.copyToSky();
        break;
      case "KeyV":
        this.copyFromSky();
        break;
      case "KeyF":
        this.clearSky();
        break;
      default:
        return true;
    }
    e.preventDefault();
    return false;
  }
}

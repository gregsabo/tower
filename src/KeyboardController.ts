import Invocation from './Invocation';
import { IInvocation } from './Types';
import { findById, ITraversalResult } from './ProgramTraversal';
import Socket from './Socket';
import History from './History';
import Constant from './Constant';
import App from './App';

const log = console.log;

export default class KeyboardController {
  public history: History;
  private app: App;

  constructor(app: App) {
    this.app = app;
    this.history = new History();
  }

  public registerKeyEvents() {
    document.addEventListener('keydown', e => {
      this.onKeyDown(e);
      return true;
    });
  }

  public findCanAboveCursor() {
    const result = findById(
      this.app.currentBrick(),
      this.app.state.canCursorId
    );
    if (!result) {
      log('No result found. Assuming bottom.');
      return this.app.currentBrick().rootInvocation.uniqueId;
    }
    if (result.invocation.args && result.invocation.args.length > 0) {
      return result.invocation.args[0].uniqueId;
    } else {
      return null;
    }
  }

  public findCanBelowCursor() {
    const result = findById(
      this.app.currentBrick(),
      this.app.state.canCursorId
    );
    console.log('Trying to find below cursor', result);
    if (!result) {
      log('No result found. Assuming bottom.');
      return this.app.currentBrick().rootInvocation.uniqueId;
    }
    if (result.path.length === 0) {
      log('Bottom of tower. Cannot go down.');
      return null;
    }
    return result.path[result.path.length - 1].uniqueId;
  }

  public findCanToLeftOfCursor() {
    const result = findById(
      this.app.currentBrick(),
      this.app.state.canCursorId
    );
    if (!result) {
      log('No result found. Assuming bottom.');
      return this.app.currentBrick().rootInvocation.uniqueId;
    }
    if (result.path.length === 0) {
      log('Bottom of tower. Cannot go down.');
      return null;
    }
    const parent = result.path[result.path.length - 1];
    const index = parent.args.indexOf(result.invocation);
    if (index === 0) {
      // just move down.
      return parent.uniqueId;
    }
    return parent.args[index - 1].uniqueId;
  }

  public findCanToRightOfCursor() {
    const result = findById(
      this.app.currentBrick(),
      this.app.state.canCursorId
    );
    if (!result) {
      log('No result found. Assuming bottom.');
      return this.app.currentBrick().rootInvocation.uniqueId;
    }
    if (result.path.length === 0) {
      log('Bottom of tower. Cannot go down.');
      return null;
    }
    const parent = result.path[result.path.length - 1];
    const index = parent.args.indexOf(result.invocation);
    if (index + 1 === parent.args.length) {
      // just move down.
      return parent.uniqueId;
    }
    return parent.args[index + 1].uniqueId;
  }

  public moveCursorTo(uniqueId: string | null) {
    if (uniqueId === null) {
      return;
    }
    this.app.setState({
      canCursorId: uniqueId
    });
  }

  public enterInsertMode() {
    this.app.setState({
      editorMode: 'insert'
    });
  }

  public enterCursorMode() {
    this.app.setState({
      editorMode: 'cursor'
    });
  }

  public deleteSelectedCan() {
    const result = findById(
      this.app.currentBrick(),
      this.app.state.canCursorId
    );
    if (!result) {
      throw new Error("Couldn't find can to delete.");
    }
    this.replaceResult(result, Socket.create({}));
    this.app.setState({
      editorMode: 'cursor'
    });
    this.app.modulesChanged();
  }

  public replaceResult(result: ITraversalResult, value: IInvocation) {
    const parent = result.path[result.path.length - 1];
    if (parent) {
      const index = parent.args.indexOf(result.invocation);
      parent.args[index] = value;
      this.app.setState({
        canCursorId: parent.args[index].uniqueId
      });
    } else {
      this.app.currentBrick().rootInvocation = value;
      this.app.setState({
        canCursorId: this.app.currentBrick().rootInvocation.uniqueId
      });
    }
  }

  public visitSelectedBrick() {
    const result = findById(
      this.app.currentBrick(),
      this.app.state.canCursorId
    );
    if (result === false) {
      console.log('Could not find brick');
      return;
    }
    if (result.invocation.types.indexOf('invocation') === -1) {
      return;
    }
    const brick = Invocation.libraryFunction(
      result.invocation,
      this.app.state.library,
      this.app.state.modules
    );
    if (!brick.brickKey || !brick.moduleKey) {
      return;
    }
    console.log('Got module', brick, 'key', brick.moduleKey);
    this.app.setState({
      currentBrickId: brick.brickKey,
      currentModuleId: brick.moduleKey
    });
    this.history.remember(brick.moduleKey, brick.brickKey);
  }

  public goBack() {
    const current = this.history.goBack();
    console.log('going back', current);
    this.app.setState({
      currentBrickId: current.brickKey,
      currentModuleId: current.moduleKey
    });
  }

  public goForwards() {
    const current = this.history.goForwards();
    console.log('going forwards', current);
    this.app.setState({
      currentBrickId: current.brickKey,
      currentModuleId: current.moduleKey
    });
  }

  public editConstant() {
    this.app.setState({
      editorMode: 'constant'
    });
    const result = findById(
      this.app.currentBrick(),
      this.app.state.canCursorId
    );
    if (result === false) {
      return;
    }
    let constant;
    if (!Constant.describes(result.invocation)) {
      constant = Constant.create({});
      this.replaceResult(result, constant);
    }
  }

  public goToTestMode() {
    this.app.setState({
      editorMode: 'test'
    });
  }

  public renameBrick() {
    this.app.setState({
      editorMode: 'naming'
    });
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.metaKey) {
      // Don't interfere with browser shortcuts
      return true;
    }
    if (e.code === 'Escape') {
      this.enterCursorMode();
    }
    if (this.app.state.editorMode !== 'cursor') {
      return true;
    }
    // if (e.target !== window.document.body) {
    //     return true;
    // }
    switch (e.code) {
      case 'KeyU':
        this.app.undo();
        break;
      case 'KeyY':
        this.app.redo();
        break;
      case 'KeyI':
        this.enterInsertMode();
        break;
      case 'KeyD':
        this.deleteSelectedCan();
        break;
      case 'KeyM':
        this.visitSelectedBrick();
        break;
      case 'KeyE':
        this.goBack();
        break;
      case 'KeyR':
        this.goForwards();
        break;
      case 'KeyT':
        this.goToTestMode();
        break;
      case 'KeyN':
        this.renameBrick();
        break;
      case 'KeyO':
        this.editConstant();
        break;
      case 'KeyJ':
        this.moveCursorTo(this.findCanBelowCursor());
        break;
      case 'KeyK':
        this.moveCursorTo(this.findCanAboveCursor());
        break;
      case 'KeyH':
        this.moveCursorTo(this.findCanToLeftOfCursor());
        break;
      case 'KeyL':
        this.moveCursorTo(this.findCanToRightOfCursor());
        break;
      default:
        return true;
    }
    e.preventDefault();
    return false;
  }
}

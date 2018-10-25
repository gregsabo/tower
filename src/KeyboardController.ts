import {findById} from "./ProgramTraversal";

const log = console.log;

export default class KeyboardController {
    private app: any;

    constructor(app: any) {
        this.app = app;
    }

    public registerKeyEvents() {
        document.addEventListener("keydown", (e) => {
            this.onKeyDown(e);
            return true;
        });
    }

    public findCanAboveCursor() {
        const result = findById(this.app.currentBrick(), this.app.state.canCursorId);
        if (!result) {
            log("No result found. Assuming bottom.");
            return this.app.currentBrick().rootInvocation.uniqueId;
        }
        if (result.invocation.args && result.invocation.args.length > 0) {
            return result.invocation.args[0].uniqueId;
        } else {
            return null;
        }
    }

    public findCanBelowCursor() {
        const result = findById(this.app.currentBrick(), this.app.state.canCursorId);
        if (!result) {
            log("No result found. Assuming bottom.");
            return this.app.currentBrick().rootInvocation.uniqueId;
        }
        if (result.path.length === 0) {
            log("Bottom of tower. Cannot go down.");
            return null;
        }
        return result.path[result.path.length - 1].uniqueId;
    }

    public findCanToLeftOfCursor() {
        const result = findById(this.app.currentBrick(), this.app.state.canCursorId);
        if (!result) {
            log("No result found. Assuming bottom.");
            return this.app.state.programs[0].uniqueId;
        }
        if (result.path.length === 0) {
            log("Bottom of tower. Cannot go down.");
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
        const result = findById(this.app.currentBrick(), this.app.state.canCursorId);
        if (!result) {
            log("No result found. Assuming bottom.");
            return this.app.state.programs[0].uniqueId;
        }
        if (result.path.length === 0) {
            log("Bottom of tower. Cannot go down.");
            return;
        }
        const parent = result.path[result.path.length - 1];
        const index = parent.args.indexOf(result.invocation);
        if (index + 1 === parent.args.length) {
            // just move down.
            return parent.uniqueId;
        }
        return parent.args[index + 1].uniqueId;
    }

    public moveCursorTo(uniqueId: string|null) {
        if (uniqueId === null) {
            return;
        }
        this.app.setState({
            canCursorId: uniqueId
        });
    }

    private onKeyDown(e: KeyboardEvent) {
        if (e.code === "KeyJ") {
            this.moveCursorTo(this.findCanBelowCursor());
        }
        if (e.code === "KeyK") {
            this.moveCursorTo(this.findCanAboveCursor());
        }
        if (e.code === "KeyH") {
            this.moveCursorTo(this.findCanToLeftOfCursor());
        }
        if (e.code === "KeyL") {
            this.moveCursorTo(this.findCanToRightOfCursor());
        }

    }
}

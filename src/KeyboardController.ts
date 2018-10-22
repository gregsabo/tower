import {findById} from "./ProgramTraversal";

const log = console.log;

export default class KeyboardController {
    private app: any;

    constructor(app: any) {
        this.app = app;
    }

    public registerKeyEvents() {
        document.addEventListener("keydown", (e) => {
            log("document got keydown", e, this.app);
            this.onKeyDown(e);
            return true;
        });
    }

    public moveCursorUp() {
        log("Trying to go up.");
        const result = findById(this.app.state.programs, this.app.state.canCursorId);
        if (!result) {
            log("No result found. Cannot move cursor.");
            return;
        }
        if (result.invocation.args && result.invocation.args.length > 0) {
            this.app.setState({
                canCursorId: result.invocation.args[0].uniqueId
            });
        } else {
            log("No args, cannot move cursor up.");
        }
    }

    public moveCursorDown() {
        const result = findById(this.app.state.programs, this.app.state.canCursorId);
        if (!result) {
            log("No result found. Cannot move cursor.");
            return;
        }
        if (result.path.length === 0) {
            log("Bottom of tower. Cannot go down.");
            return;
        }
        this.app.setState({
            canCursorId: result.path[result.path.length - 1].uniqueId
        });
    }

    private onKeyDown(e: KeyboardEvent) {
        if (e.code === "KeyJ") {
            this.moveCursorDown();
        }
        if (e.code === "KeyK") {
            this.moveCursorUp();
        }

    }
}

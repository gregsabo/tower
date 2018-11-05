export default class UndoManager {
    private capacity: number;
    private history: string[];
    private historyPointer = -1;

    constructor(capacity: number) {
        this.history = [];
    }

    public remember(data: any) {
        this.historyPointer += 1;
        this.history = this.history.slice(0, this.historyPointer);
        this.history.push(JSON.stringify(data));
        while (this.history.length > this.capacity) {
            console.log("Evicting old undo");
            this.history = this.history.slice(1);
        }
        console.log("Remembering", this.history, this.historyPointer);
    }

    public undoAble() {
        return this.history.length > 0 && this.historyPointer > 0;
    }

    public undo() {
        if (!this.undoAble()) {
            throw new Error("Tried to undo something not undoable.");
        }
        this.historyPointer -= 1;
        console.log("undoing", this.history, this.historyPointer);
        return JSON.parse(this.history[this.historyPointer]);
    }

    public redoAble() {
        return this.history.length > 0 && this.historyPointer < this.history.length - 1;
    }

    public redo() {
        if (!this.redoAble()) {
            throw new Error("Tried to redo something not redoable.");
        }
        this.historyPointer += 1;
        return JSON.parse(this.history[this.historyPointer]);
    }
}

interface IHistoryEntry {
    brickKey: string;
    moduleKey: string;
};

export default class History {
    private history: IHistoryEntry[];
    private historyPointer = -1;

    constructor() {
        this.history = [];
    }

    public remember(moduleKey, brickKey) {
        console.log("About to remember", this.history, this.historyPointer);
        if (this.historyPointer + 1 < this.history.length) {
            this.history = this.history.slice(0, this.historyPointer + 1);
        }
        this.history.push({moduleKey, brickKey});
        this.historyPointer += 1;
        console.log("Just remembered", this.history, this.historyPointer);
    }

    public goBack() {
        console.log("History going back", this.history, this.historyPointer);
        if (this.historyPointer === 0) {
            return this.history[this.historyPointer];
        }
        this.historyPointer -= 1;
        const rval = this.history[this.historyPointer];
        console.log("History went back", this.history, this.historyPointer);
        return rval;
    }

    public goForwards() {
        if (this.historyPointer === (this.history.length - 1)) {
            return this.history[this.historyPointer];
        }
        this.historyPointer += 1;
        const rval = this.history[this.historyPointer];
        return rval;
    }
}

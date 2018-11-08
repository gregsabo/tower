export default class History {
    private history: object[];
    private historyPointer = -1;

    constructor() {
        this.history = [];
    }

    public remember(moduleKey, brickKey) {
        if (this.historyPointer < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyPointer);
        }
        this.history.push({moduleKey, brickKey});
        this.historyPointer += 1;
    }

    public goBack() {
        if (this.historyPointer === 0) {
            return this.history[this.historyPointer];
        }
        const rval = this.history[this.historyPointer];
        this.historyPointer -= 1;
        return rval;
    }

    public goForwards() {
        if (this.historyPointer === (this.history.length - 1)) {
            return this.history[this.historyPointer];
        }
        const rval = this.history[this.historyPointer];
        this.historyPointer += 1;
        return rval;
    }
}

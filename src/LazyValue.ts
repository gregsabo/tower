export default class LazyValue {
    public isLazyValue = true;
    private value: null;
    private evaluated: boolean;
    private evaluationFunction: any;

    constructor(evaluationFunction: any) {
        this.value = null;
        this.evaluationFunction = evaluationFunction;
        this.evaluated = false;
    }

    public get() {
        if (!this.evaluated) {
            this.value = this.evaluationFunction();
            this.evaluated = true;
        }
        return this.value;
    }
}

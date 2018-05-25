export default class Constant {
    public uniqueId = String(Math.random());
    public value: any;
    public isConstant = true;

    public constructor(value: any) {
        this.value = value;
    }
}

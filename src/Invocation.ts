interface ILibraryFunction {
    name: string;
    implementation: any;
    numArgs: number;
}

class Invocation {
    public libraryFunction: ILibraryFunction;
    public args: any;
    public isInvocation: boolean;

    constructor(libraryFunction: ILibraryFunction, args: any) {
        this.libraryFunction = libraryFunction;
        this.args = args;
        this.isInvocation = true;
    }

    public invoke() {
        this.libraryFunction.implementation.call(this.args);
    }
}

export default Invocation;

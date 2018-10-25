class Invocation {
    public isInvocation = true;
    public uniqueId = String(Math.random());
    public implementationKey: string;
    public args: any[];

    constructor(implementationKey: string, args: any[]) {
        this.implementationKey = implementationKey;
        this.args = args;
    }

    public invoke(args: any[], library: any) {
        return this.implementation(library)(...args);
    }

    public numArgs(library: any) {
        return this.libraryFunction(library).numArgs || 0;
    }

    public name(library: any) {
        return this.libraryFunction(library).name;
    }

    public implementation(library: any) {
        return this.libraryFunction(library).implementation;
    }

    public libraryFunction(library: any) {
        return library[this.implementationKey];
    }
}

export default Invocation;

import * as Modules from "./Modules";
import * as Runtime from "./Runtime";

class Invocation {
    public isInvocation = true;
    public uniqueId = String(Math.random());
    public implementationKey: string;
    public args: any[];

    constructor(implementationKey: string, args: any[]) {
        this.implementationKey = implementationKey;
        this.args = args;
    }

    public invoke(args: any[], library: any, modules: any) {
        return this.implementation(library, modules)(...args);
    }

    public numArgs(library: any, modules: any) {
        return this.libraryFunction(library, modules) || 0;
    }

    public name(library: any, modules: any) {
        return this.libraryFunction(library, modules).name;
    }

    public implementation(library: any, modules: any) {
        const libraryFunction = this.libraryFunction(library, modules)
        if (libraryFunction.rootInvocation) {
            return (...args: any[]) => {
                return Runtime.evaluate(
                    libraryFunction.rootInvocation,
                    args,
                    library,
                    modules,
                    {}
                );
            };
        } else {
            return libraryFunction.implementation;
        }
    }

    public maybeLookupModule(item: any, modules: any) {
        if (item.moduleKey && item.brickKey) {
            return Modules.getBrickFromModules(
                item.moduleKey, item.brickKey, modules
            )
        } else {
            return item;
        }
    }

    public libraryFunction(library: any, modules: any) {
        return this.maybeLookupModule(
            library[this.implementationKey], modules
        );
    }
}

export default Invocation;

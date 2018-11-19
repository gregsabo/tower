import * as Modules from "./Modules";
import * as Runtime from "./Runtime";
import makeType from "./TowerType";
import {IInvocation, ILibrary, IModules} from "./Types";

const Invocation = makeType("invocation", ["args", "implementationKey"], {
    invoke: (self: any, args: any[], library: ILibrary, modules: IModules) => {
        return Invocation.implementation(self, library, modules)(...args);
    },

    numArgs: (self: any, library: ILibrary, modules: IModules) => {
        return Invocation.libraryFunction(self, library, modules) || 0;
    },

    getName: (self: any, library: ILibrary, modules: IModules) => {
        return Invocation.libraryFunction(self, library, modules).name;
    },

    implementation: (self: any, library: ILibrary, modules: IModules) => {
        const libraryFunction = Invocation.libraryFunction(self, library, modules);
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
    },

    maybeLookupModule: (item: any, modules: IModules) => {
        if (item.moduleKey && item.brickKey) {
            return Modules.getBrickFromModules(
                item.moduleKey, item.brickKey, modules
            );
        } else {
            return item;
        }
    },

    libraryFunction: (self: any, library: ILibrary, modules: IModules) => {
        return Invocation.maybeLookupModule(
            library[self.implementationKey], modules
        );
    }
});

const oldCreate = Invocation.create;
Invocation.create = (...args: any[]) : IInvocation => {
    return oldCreate(...args) as IInvocation;
}

export default Invocation;

import * as Modules from "./Modules";
import * as Runtime from "./Runtime";
import makeType from "./TowerType";
import {IInvocation} from "./Types";

const Invocation = makeType("invocation", ["args", "implementationKey"], {
    invoke: (self: any, args: any[], library: any, modules: any) => {
        return Invocation.implementation(self, library, modules)(...args);
    },

    numArgs: (self: any, library: any, modules: any) => {
        return Invocation.libraryFunction(self, library, modules) || 0;
    },

    getName: (self: any, library: any, modules: any) => {
        return Invocation.libraryFunction(self, library, modules).name;
    },

    implementation: (self: any, library: any, modules: any) => {
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

    maybeLookupModule: (item: any, modules: any) => {
        if (item.moduleKey && item.brickKey) {
            return Modules.getBrickFromModules(
                item.moduleKey, item.brickKey, modules
            );
        } else {
            return item;
        }
    },

    libraryFunction: (self: any, library: any, modules: any) => {
        return Invocation.maybeLookupModule(
            library[self.implementationKey], modules
        );
    }
});

const oldCreate = Invocation.create;
Invocation.create = (...args: any[]) => {
    return oldCreate(...args) as IInvocation;
}

export default Invocation;

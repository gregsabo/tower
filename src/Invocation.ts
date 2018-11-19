import * as Modules from './Modules';
import * as Runtime from './Runtime';
import makeType from './TowerType';
import { IInvocation, ILibrary, IModules } from './Types';

const Invocation = makeType('invocation', ['args', 'implementationKey'], {
  invoke: (
    self: IInvocation,
    args: IInvocation[],
    library: ILibrary,
    modules: IModules
  ) => {
    return Invocation.implementation(self, library, modules)(...args);
  },

  getName: (self: IInvocation, library: ILibrary, modules: IModules) => {
    return Invocation.libraryFunction(self, library, modules).name;
  },

  implementation: (self: IInvocation, library: ILibrary, modules: IModules) => {
    const libraryFunction = Invocation.libraryFunction(self, library, modules);
    if (libraryFunction.rootInvocation) {
      return (...args: IInvocation[]) => {
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
        item.moduleKey,
        item.brickKey,
        modules
      );
    } else {
      return item;
    }
  },

  libraryFunction: (
    self: IInvocation,
    library: ILibrary,
    modules: IModules
  ) => {
    return Invocation.maybeLookupModule(
      library[self.implementationKey],
      modules
    );
  }
});

const oldCreate = Invocation.create;
Invocation.create = (...args: IInvocation[]): IInvocation => {
  return oldCreate(...args) as IInvocation;
};

export default Invocation;

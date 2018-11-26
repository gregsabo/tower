import * as Modules from "./Modules";
import * as Runtime from "./Runtime";
import { ILibrary, IModules, ImplementationKey, UniqueId } from "./Types";
import { Brick } from "./Brick";
import { deserializeBrick } from "./Deserialization";

export class Invocation extends Brick {
  public static fromJSON(inJson: any): Invocation {
    return new Invocation({
      ...inJson,
      ...{ args: inJson.args.map(deserializeBrick) }
    });
  }

  public args: Brick[];
  public implementationKey: ImplementationKey;

  constructor(props: {
    uniqueId?: UniqueId;
    args: Brick[];
    implementationKey: ImplementationKey;
  }) {
    super(props.uniqueId);
    this.args = props.args;
    this.implementationKey = props.implementationKey;
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("invocation");
    json.args = this.args.map(item => item.toJSON());
    json.implementationKey = this.implementationKey;
    return json;
  }

  public invoke(args: Invocation[], library: ILibrary, modules: IModules) {
    return this.implementation(library, modules)(...args);
  }

  public getName(library: ILibrary, modules: IModules) {
    return this.libraryFunction(library, modules).name;
  }

  public implementation(library: ILibrary, modules: IModules) {
    const libraryFunction = this.libraryFunction(library, modules);
    if (libraryFunction.rootBrick) {
      return (...args: Brick[]) => {
        return Runtime.evaluate(
          libraryFunction.rootBrick,
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

  public maybeLookupModule(item: any, modules: IModules) {
    if (item.moduleKey && item.brickKey) {
      return Modules.getTowerFromModules(
        item.moduleKey,
        item.brickKey,
        modules
      );
    } else {
      return item;
    }
  }

  public libraryFunction(library: ILibrary, modules: IModules) {
    return this.maybeLookupModule(library[this.implementationKey], modules);
  }
}

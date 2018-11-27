import * as Modules from "./Modules";
import * as Runtime from "./Runtime";
import { ILibrary, IModules, ImplementationKey, UniqueId } from "./Types";
import { Brick } from "./Brick";
import { deserializeBrick } from "./Deserialization";

export class Invocation extends Brick {
  public static fromJSON(inJson: any): Invocation {
    return new Invocation({
      ...inJson,
      ...{ inputs: inJson.inputs.map(deserializeBrick) }
    });
  }

  public inputs: Brick[];
  public implementationKey: ImplementationKey;

  constructor(props: {
    uniqueId?: UniqueId;
    inputs: Brick[];
    implementationKey: ImplementationKey;
  }) {
    super(props.uniqueId);
    this.inputs = props.inputs;
    this.implementationKey = props.implementationKey;
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("invocation");
    json.inputs = this.inputs.map(item => item.toJSON());
    json.implementationKey = this.implementationKey;
    return json;
  }

  public invoke(inputs: Invocation[], library: ILibrary, modules: IModules) {
    return this.implementation(library, modules)(...inputs);
  }

  public getName(library: ILibrary, modules: IModules) {
    return this.libraryFunction(library, modules).name;
  }

  public implementation(library: ILibrary, modules: IModules) {
    const libraryFunction = this.libraryFunction(library, modules);
    if (libraryFunction.rootBrick) {
      return (...inputs: Brick[]) => {
        return Runtime.evaluate(
          libraryFunction.rootBrick,
          inputs,
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

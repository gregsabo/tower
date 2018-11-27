import * as Modules from "./Modules";
import * as Runtime from "./Runtime";
import {
  ILibrary,
  IModules,
  ImplementationKey,
  UniqueId,
  IInputConfiguration
} from "./Types";
import { Brick } from "./Brick";
import { deserializeBrick } from "./Deserialization";

export class Invocation extends Brick {
  public static fromJSON(inJson: any): Invocation {
    const inputs = {};
    for (const key in inJson.inputs) {
      if (inJson.inputs.hasOwnProperty(key)) {
        inputs[key] = deserializeBrick(inJson.inputs[key]);
      }
    }
    return new Invocation({
      ...inJson,
      ...{ inputs }
    });
  }

  public inputs: { [key: string]: Brick };
  public implementationKey: ImplementationKey;

  constructor(props: {
    uniqueId?: UniqueId;
    inputs: { [key: string]: Brick };
    implementationKey: ImplementationKey;
  }) {
    super(props.uniqueId);
    this.inputs = props.inputs;
    this.implementationKey = props.implementationKey;
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("invocation");
    json.inputs = {};
    for (const key in this.inputs) {
      if (this.inputs.hasOwnProperty(key)) {
        json.inputs[key] = this.inputs[key].toJSON();
      }
    }
    json.implementationKey = this.implementationKey;
    return json;
  }

  public invoke(inputs: Invocation[], library: ILibrary, modules: IModules) {
    return this.implementation(library, modules)(...inputs);
  }

  public getName(library: ILibrary, modules: IModules) {
    return this.libraryFunction(library, modules).name;
  }

  public getInputConfiguration(
    library: ILibrary,
    modules: IModules
  ): IInputConfiguration[] {
    return this.libraryFunction(library, modules).inputs;
  }

  public getOrderedInputs(library: ILibrary, modules: IModules): Brick[] {
    const configs = this.getInputConfiguration(library, modules);
    return configs.map(config => {
      return this.inputs[config.key];
    });
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

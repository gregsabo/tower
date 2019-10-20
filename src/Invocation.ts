import * as Modules from "./Modules";
import * as Runtime from "./Runtime";
import {
  ILibrary,
  IModules,
  ImplementationKey,
  UniqueId,
  IInputConfiguration,
  TowerPrimitive
} from "./Types";
import { Brick } from "./Brick";
import { deserializeBrick } from "./Deserialization";
import { ITowerType, ITowerTypeError } from "./ITowerType";

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

  public invoke(
    inputs: TowerPrimitive[],
    library: ILibrary,
    modules: IModules
  ) {
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
      if (typeof this.inputs[config.key] === "undefined") {
        throw new Error(
          `Invocation ${
            this.implementationKey
          } didn't get a value for input key '${config.key}'.`
        );
      }
      return this.inputs[config.key];
    });
  }

  public implementation(library: ILibrary, modules: IModules) {
    const libraryFunction = this.libraryFunction(library, modules);
    if (libraryFunction.rootBrick) {
      return (...inputs: TowerPrimitive[]) => {
        const inputKeysToIndexes = {};
        this.getInputConfiguration(library, modules).map(
          (inputConfig: IInputConfiguration, num: number) => {
            inputKeysToIndexes[inputConfig.key] = num;
          }
        );

        return Runtime.evaluate(
          libraryFunction.rootBrick,
          inputs,
          inputKeysToIndexes,
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
    if (item.moduleKey && item.towerKey) {
      return Modules.getTowerFromModules(
        item.moduleKey,
        item.towerKey,
        modules
      );
    } else {
      return item;
    }
  }

  public libraryFunction(library: ILibrary, modules: IModules) {
    return this.maybeLookupModule(library[this.implementationKey], modules);
  }

  public typeErrorForExpectedType(type: ITowerType, library: ILibrary, modules: IModules): ITowerTypeError|null {
    // TODO: Look up the module
    // if it's a library function, compare against its hardcoded type.
    // if it's a tower, then delegate to whatever its root brick is.
    const module = this.libraryFunction(library, modules);
    console.log("module is", module);
    return null;
  }
}

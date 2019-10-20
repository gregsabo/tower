import { makeUniqueId } from "./MakeUniqueId";
import { UniqueId, ILibrary, IModules } from "./Types";
import { ITowerType, ITowerTypeError } from "./ITowerType";

export abstract class Brick {
  public uniqueId: UniqueId;

  constructor(uniqueId?: UniqueId) {
    if (uniqueId) {
      this.uniqueId = uniqueId;
    } else {
      this.uniqueId = makeUniqueId();
    }
  }

  public toJSON(): any {
    return {
      types: ["brick"],
      uniqueId: this.uniqueId
    };
  }

  public abstract typeErrorForExpectedType(type: ITowerType, library: ILibrary, modules: IModules): ITowerTypeError|null;
}
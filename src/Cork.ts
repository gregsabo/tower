import { Brick } from "./Brick";
import { ITowerType, ITowerTypeError } from "./ITowerType";

export class Cork extends Brick {
  public static fromJSON(inJson: any): Cork {
    return new Cork(inJson);
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("cork");
    return json;
  }

  public typeErrorForExpectedType(type: ITowerType): ITowerTypeError|null {
    return null;
  }
}

import { Brick } from "./Brick";
import { ITowerType, ITowerTypeError } from "./ITowerType";

export class Socket extends Brick {
  public static fromJSON(inJson: any): Socket {
    return new Socket(inJson);
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("socket");
    return json;
  }

  public typeErrorForExpectedType(type: ITowerType): ITowerTypeError|null {
    return null;
  }
}

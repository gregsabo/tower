import { Brick } from "./Brick";

export class Cork extends Brick {
  public static fromJSON(inJson: any): Cork {
    return new Cork(inJson);
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("cork");
    return json;
  }
}

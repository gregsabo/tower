import { Brick } from "./Brick";

export class Input extends Brick {
  public static fromJSON(inJson: any): Input {
    return new Input(inJson);
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("input");
    return json;
  }
}

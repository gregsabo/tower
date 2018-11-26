import { Brick } from "./Brick";

export class Arg extends Brick {
  public static fromJSON(inJson: any): Arg {
    return new Arg(inJson);
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("arg");
    return json;
  }
}

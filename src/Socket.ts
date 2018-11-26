import { Brick } from "./Brick";

export class Socket extends Brick {
  public static fromJSON(inJson: any): Socket {
    return new Socket(inJson);
  }

  public toJSON() {
    const json = super.toJSON();
    json.types.push("socket");
    return json;
  }
}

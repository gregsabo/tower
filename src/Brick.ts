import { TowerType } from "./TowerType";

export abstract class Brick extends TowerType {
  public toJSON() {
    const json = super.toJSON();
    json.types.push("brick");
    return json;
  }
}

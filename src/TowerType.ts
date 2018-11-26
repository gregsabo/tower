import { makeUniqueId } from "./MakeUniqueId";
import { UniqueId } from "./Types";

export class TowerType {
  public static fromJSON(inJson: any) {
    return new TowerType(inJson.uniqueId);
  }

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
      types: [],
      uniqueId: this.uniqueId
    };
  }
}

import { makeUniqueId } from "./MakeUniqueId";
import { TowerType } from "./TowerType";
import { deserializeBrick } from "./Deserialization";

export const copyTowerObject = (inObject: TowerType) => {
  const asJson = inObject.toJSON();
  clearUniqueIds(asJson);
  return deserializeBrick(asJson);
};

function clearUniqueIds(inObject: any) {
  inObject.uniqueId = makeUniqueId();
  if (inObject.inputs) {
    inObject.inputs.forEach(clearUniqueIds);
  }
}

import { makeUniqueId } from "./MakeUniqueId";
import { deserializeBrick } from "./Deserialization";
import { Brick } from "./Brick";

export const copyTowerObject = (inObject: Brick) => {
  const asJson = inObject.toJSON();
  clearUniqueIds(asJson);
  return deserializeBrick(asJson);
};

function clearUniqueIds(inObject: any) {
  inObject.uniqueId = makeUniqueId();
  if (inObject.inputs) {
    for (const key in inObject.inputs) {
      if (!inObject.inputs.hasOwnProperty(key)) {
        continue;
      }
      clearUniqueIds(inObject.inputs[key]);
    }
  }
}

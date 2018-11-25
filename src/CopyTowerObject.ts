import { makeUniqueId } from "./MakeUniqueId";
import { ITowerType } from "./Types";

export const copyTowerObject = (inObject: ITowerType) => {
  if (typeof inObject === "string") {
    return inObject;
  }
  const newObject: ITowerType = {
    types: inObject.types,
    uniqueId: makeUniqueId()
  };
  Object.keys(inObject).forEach(key => {
    if (key === "uniqueId") {
      return;
    } else if (inObject[key].uniqueId) {
      newObject[key] = copyTowerObject(inObject[key]);
    } else if (Array.isArray(inObject[key])) {
      newObject[key] = inObject[key].map(copyTowerObject);
    } else {
      newObject[key] = inObject[key];
    }
  });
  return newObject;
};

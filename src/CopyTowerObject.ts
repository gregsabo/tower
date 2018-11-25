import { makeUniqueId } from "./MakeUniqueId";
import { IHasUniqueId } from "./Types";

export const copyTowerObject = (inObject: IHasUniqueId) => {
  const newObject: IHasUniqueId = {
    uniqueId: makeUniqueId()
  };
  Object.keys(inObject).forEach(key => {
    if (key === "uniqueId") {
      return;
    } else if (inObject[key].uniqueId !== undefined) {
      newObject[key] = copyTowerObject(inObject[key]);
    } else {
      newObject[key] = inObject[key];
    }
  });
  return newObject;
};

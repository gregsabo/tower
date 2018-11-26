import { Arg } from "./Arg";
import { Cork } from "./Cork";
import { Constant } from "./Constant";
import { Invocation } from "./Invocation";
import { BrickTypeName } from "./Types";
import { Socket } from "./Socket";

export function deserializeBrick(inJson: any) {
  const finalType = inJson.types[inJson.types.length - 1] as BrickTypeName;
  switch (finalType) {
    case "arg":
      return Arg.fromJSON(inJson);
    case "cork":
      return Cork.fromJSON(inJson);
    case "constant":
      return Constant.fromJSON(inJson);
    case "socket":
      return Socket.fromJSON(inJson);
    case "invocation":
      return Invocation.fromJSON(inJson);
  }
  throw new Error(`Unrecognized type ${finalType}`);
}

export function deserializeModules(inJson: any) {
  Object.keys(inJson).forEach(moduleKey => {
    const towers = inJson[moduleKey].towers;
    Object.keys(towers).forEach(towerKey => {
      towers[towerKey].rootBrick = deserializeBrick(towers[towerKey].rootBrick);
    });
  });
  return inJson;
}

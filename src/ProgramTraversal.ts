import { UniqueId, ITower } from "./Types";
import { Brick } from "./Brick";
import { Invocation } from "./Invocation";

export interface ITraversalResult {
  brick: Brick;
  path: Invocation[];
}

export function findById(
  program: ITower,
  uniqueId: UniqueId
): ITraversalResult | false {
  if (program.rootBrick.uniqueId === uniqueId) {
    return {
      brick: program.rootBrick,
      path: []
    };
  }
  return recurseFind(program.rootBrick, uniqueId, []);
}

function recurseFind(
  brick: Brick,
  uniqueId: UniqueId,
  path: Invocation[]
): ITraversalResult | false {
  if (!(brick instanceof Invocation)) {
    return false;
  }
  for (const key in brick.inputs) {
    if (!brick.inputs.hasOwnProperty(key)) {
      continue;
    }
    const value = brick.inputs[key];
    if (value.uniqueId === uniqueId) {
      return {
        brick: value,
        path: path.concat([brick])
      };
    }
    const found = recurseFind(value, uniqueId, path.concat([brick]));
    if (found) {
      return found;
    }
  }
  return false;
}

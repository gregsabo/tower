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
  for (const arg of brick.args) {
    if (arg.uniqueId === uniqueId) {
      return {
        brick: arg,
        path: path.concat([brick])
      };
    }
    const found = recurseFind(arg, uniqueId, path.concat([brick]));
    if (found) {
      return found;
    }
  }
  return false;
}

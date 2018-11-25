import { UniqueId, IBrick, IInvocation, Placeable } from "./Types";

export interface ITraversalResult {
  invocation: Placeable;
  path: IInvocation[];
}

export function findById(program: IBrick, uniqueId: UniqueId) {
  if (program.rootInvocation.uniqueId === uniqueId) {
    return {
      invocation: program.rootInvocation,
      path: []
    };
  }
  return recurseFind(program.rootInvocation as IInvocation, uniqueId, []);
}

function recurseFind(
  program: IInvocation,
  uniqueId: UniqueId,
  path: IInvocation[]
): ITraversalResult | false {
  if (program.args === undefined) {
    return false;
  }
  for (const arg of program.args) {
    if (arg.uniqueId === uniqueId) {
      return {
        invocation: arg,
        path: path.concat([program])
      };
    }
    const found = recurseFind(
      arg as IInvocation,
      uniqueId,
      path.concat([program])
    );
    if (found) {
      return found;
    }
  }
  return false;
}

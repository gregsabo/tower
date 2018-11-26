import { Arg } from "./Arg";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import { Invocation } from "./Invocation";
import LazyValue from "./LazyValue";
import { Socket } from "./Socket";
import TowerError from "./TowerError";
import { ILibrary, IModules, TowerPrimitive } from "./Types";
import { Brick } from "./Brick";

export function evaluate(
  brick: Brick,
  inputs: TowerPrimitive[] | Brick[],
  library: any,
  modules: IModules,
  resultMap: object
): any {
  if (!(brick instanceof Invocation)) {
    return brick;
  }
  const invocation = brick;
  const lazyArgs = makeLazyArgs(
    invocation.args,
    inputs,
    library,
    modules,
    resultMap
  );
  for (const arg of lazyArgs) {
    if (arg instanceof TowerError) {
      return arg;
    }
    if (arg instanceof Socket) {
      return arg;
    }
  }

  const returnValue = invocation.invoke(lazyArgs, library, modules);
  resultMap[brick.uniqueId] = returnValue;
  return returnValue;
}

function makeLazyArgs(
  args: any,
  inputs: any[],
  library: ILibrary,
  modules: IModules,
  resultMap: object
) {
  return args.map((arg: any) => {
    if (arg instanceof Socket) {
      return arg;
    } else if (arg instanceof Arg) {
      return LazyValue.wrap(inputs[0]);
    } else if (arg instanceof Invocation) {
      if (isInvocationGettingCorked(arg)) {
        return corkInvocation(arg, library, modules);
      } else {
        return new LazyValue(() => {
          return evaluate(arg, inputs, library, modules, resultMap);
        });
      }
    } else if (arg instanceof Constant) {
      return LazyValue.wrap(arg.value);
    }
  });
}

function isInvocationGettingCorked(invocation: Invocation) {
  for (const arg of invocation.args) {
    if (arg instanceof Cork) {
      return true;
    }
  }
  return false;
}

function corkInvocation(
  invocation: Invocation,
  library: ILibrary,
  modules: IModules
) {
  const corked = (...args: any[]) => {
    let numCorksSeen = 0;
    const finalArgs = invocation.args.map((arg: any, i: number) => {
      if (arg instanceof Cork) {
        const result = args[i - numCorksSeen];
        numCorksSeen += 1;
        return LazyValue.wrap(result);
      } else {
        return LazyValue.wrap(arg);
      }
    });
    return invocation.invoke(finalArgs, library, modules);
  };
  return LazyValue.wrap(corked);
}

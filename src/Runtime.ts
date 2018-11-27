import { Input } from "./Input";
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
  towerInputValues: TowerPrimitive[] | Brick[],
  library: any,
  modules: IModules,
  resultMap: object
): any {
  if (!(brick instanceof Invocation)) {
    return brick;
  }
  const invocation = brick;
  const lazyInputs = invocation
    .getOrderedInputs(library, modules)
    .map((input: Brick) => {
      return makeLazyValue(
        input,
        towerInputValues,
        library,
        modules,
        resultMap
      );
    });
  for (const arg of lazyInputs) {
    if (arg instanceof TowerError) {
      return arg;
    }
    if (arg instanceof Socket) {
      return arg;
    }
  }

  const returnValue = invocation.invoke(lazyInputs, library, modules);
  resultMap[brick.uniqueId] = returnValue;
  return returnValue;
}

function makeLazyValue(
  value: any, // the bricks going into me
  towerInputValues: any, // the inputs for this tower (in case one of these inputs is a Brick)
  library: ILibrary,
  modules: IModules,
  resultMap: object
) {
  if (value instanceof Socket) {
    return value;
  } else if (value instanceof Input) {
    return LazyValue.wrap(towerInputValues[0]);
  } else if (value instanceof Invocation) {
    if (isInvocationGettingCorked(value)) {
      return corkInvocation(value, library, modules);
    } else {
      return new LazyValue(() => {
        return evaluate(value, towerInputValues, library, modules, resultMap);
      });
    }
  } else if (value instanceof Constant) {
    return LazyValue.wrap(value.value);
  }
}

function isInvocationGettingCorked(invocation: Invocation) {
  for (const key in invocation.inputs) {
    if (invocation.inputs.hasOwnProperty(key)) {
      if (invocation.inputs[key] instanceof Cork) {
        return true;
      }
    }
  }
  return false;
}

function corkInvocation(
  invocation: Invocation,
  library: ILibrary,
  modules: IModules
) {
  const corked = (...inputs: any[]) => {
    let numCorksSeen = 0;
    const orderedInputs = invocation.getOrderedInputs(library, modules);
    const finalInputs = orderedInputs.map((input: any, i: number) => {
      if (input instanceof Cork) {
        const result = inputs[i - numCorksSeen];
        numCorksSeen += 1;
        return LazyValue.wrap(result);
      } else {
        return LazyValue.wrap(input);
      }
    });
    return invocation.invoke(finalInputs, library, modules);
  };
  return LazyValue.wrap(corked);
}

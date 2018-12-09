import { Input } from "./Input";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import { Invocation } from "./Invocation";
import LazyValue from "./LazyValue";
import { Socket } from "./Socket";
import TowerError from "./TowerError";
import { ILibrary, IModules, IInputValues } from "./Types";
import { Brick } from "./Brick";
import { mapValues } from "lodash";

export function evaluate(
  brick: Brick,
  towerInputValues: IInputValues,
  library: any,
  modules: IModules,
  resultMap: object
): any {
  if (!(brick instanceof Invocation)) {
    return brick;
  }
  const invocation = brick;
  // lazy inputs: map over the invocation's inputs,
  // lazifying each. This involves passing down the
  // input values from the tower as a whole.
  const lazyInputs = mapValues(invocation.inputs, input => {
    return makeLazyValue(input, towerInputValues, library, modules, resultMap);
  });

  for (const key in lazyInputs) {
    if (!lazyInputs.hasOwnProperty(key)) {
      continue;
    }
    const arg = lazyInputs[key];

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
  towerInputValues: IInputValues, // the inputs for this tower (in case one of these inputs is a Brick)
  library: ILibrary,
  modules: IModules,
  resultMap: object
) {
  if (value instanceof Socket) {
    return value;
  } else if (value instanceof Input) {
    return LazyValue.wrap(towerInputValues[value.inputKey]);
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
  } else {
    return LazyValue.wrap(value);
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
  const corked = (newInputs: IInputValues) => {
    console.log("About to merge", newInputs);
    const merged = { ...invocation.inputs, ...newInputs };
    const lazy = mapValues(merged, LazyValue.wrap);
    return invocation.invoke(lazy, library, modules);
  };
  return LazyValue.wrap(corked);
}

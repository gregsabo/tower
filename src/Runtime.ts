import { Input } from "./Input";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import { Invocation } from "./Invocation";
import LazyValue from "./LazyValue";
import { Socket } from "./Socket";
import TowerError from "./TowerError";
import { ILibrary, IModules, TowerPrimitive, IInputConfiguration } from "./Types";
import { Brick } from "./Brick";

export function evaluate(
  brick: Brick,
  towerInputValues: TowerPrimitive[],
  library: any,
  modules: IModules,
  resultMap: object
): any {
  if (!(brick instanceof Invocation)) {
    return brick;
  }
  const invocation = brick;
  const inputKeysToIndexes = {};
  invocation.getInputConfiguration(library, modules).map((inputConfig: IInputConfiguration, num: number) => {
    inputKeysToIndexes[inputConfig.key] =  num;
  });

  // lazy inputs: map over the invocation's inputs,
  // lazifying each. This involves passing down the
  // input values from the tower as a whole.
  const lazyInputs = invocation.getOrderedInputs(library, modules).map((input) => {
    return makeLazyValue(input, towerInputValues, inputKeysToIndexes, library, modules, resultMap);
  })

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
  console.log("Returnvalue", brick.implementationKey, returnValue);
  return returnValue;
}

function makeLazyValue(
  value: any, // the bricks going into me
  towerInputValues: TowerPrimitive[], // the inputs for this tower (in case one of these inputs is a Brick)
  inputKeyToInputNumMap: {[key: string]: number},
  library: ILibrary,
  modules: IModules,
  resultMap: object
) {
  if (value instanceof Socket) {
    return value;
  } else if (value instanceof Input) {
    return LazyValue.wrap(towerInputValues[inputKeyToInputNumMap[value.inputKey]]);
  } else if (value instanceof Invocation) {
    if (isInvocationGettingCorked(value)) {
      return LazyValue.wrap(corkInvocation(value, library, modules));
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
  return (...inputs: any[]) => {
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
    console.log("Invoking with final inputs", finalInputs);
    return invocation.invoke(finalInputs, library, modules);
  };
}

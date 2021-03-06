import { Input } from "./Input";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import { Invocation } from "./Invocation";
import LazyValue from "./LazyValue";
import { Socket } from "./Socket";
import TowerError from "./TowerError";
import { ILibrary, IModules, TowerPrimitive, IMocks } from "./Types";
import { Brick } from "./Brick";

export async function evaluate(
  brick: Brick,
  towerInputValues: TowerPrimitive[],
  towerInputPositionMap: { [key: string]: number },
  library: any,
  modules: IModules,
  resultMap: object,
  mocks: IMocks = {}
): Promise<any> {
  if (!(brick instanceof Invocation)) {
    return brick;
  }
  const invocation = brick;

  if (invocation.uniqueId in mocks) {
    // TODO: somehow assert expected inputs, too.
    return mocks[invocation.uniqueId].output;
  }

  // lazy inputs: map over the invocation's inputs,
  // lazifying each. This involves passing down the
  // input values from the tower as a whole.
  const lazyInputs = invocation
    .getOrderedInputs(library, modules)
    .map(input => {
      return makeLazyValue(
        input,
        towerInputValues,
        towerInputPositionMap,
        library,
        modules,
        resultMap,
        mocks
      );
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
  towerInputValues: TowerPrimitive[], // the inputs for this tower (in case one of these inputs is a Brick)
  inputKeyToInputNumMap: { [key: string]: number },
  library: ILibrary,
  modules: IModules,
  resultMap: object,
  mocks: IMocks
) {
  if (value instanceof Socket) {
    return value;
  } else if (value instanceof Input) {
    return LazyValue.wrap(
      towerInputValues[inputKeyToInputNumMap[value.inputKey]]
    );
  } else if (value instanceof Invocation) {
    if (isInvocationGettingCorked(value)) {
      return LazyValue.wrap(
        corkInvocation(
          value,
          towerInputValues,
          inputKeyToInputNumMap,
          library,
          modules,
          resultMap,
          mocks
        )
      );
    } else {
      return new LazyValue(async () => {
        return await evaluate(
          value,
          towerInputValues,
          inputKeyToInputNumMap,
          library,
          modules,
          resultMap,
          mocks
        );
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
  invocation: any,
  towerInputValues: TowerPrimitive[],
  inputKeyToInputNumMap: { [key: string]: number },
  library: ILibrary,
  modules: IModules,
  resultMap: object,
  mocks: IMocks
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
        return makeLazyValue(
          input,
          towerInputValues,
          inputKeyToInputNumMap,
          library,
          modules,
          resultMap,
          mocks
        );
      }
    });
    return invocation.invoke(finalInputs, library, modules);
  };
}

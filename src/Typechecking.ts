import { ILibrary, IModules } from "./Types";
import { Brick } from "./Brick";
import { Invocation } from "./Invocation";
import {keys} from "lodash";
import { ITowerType } from "./ITowerType";

interface ITypeError {
  expected: ITowerType,
  was: ITowerType
}

export interface ITypecheck {
  [key: string]: ITypeError;
}

export function checkTypes(
  brick: Brick,
  library: ILibrary,
  modules: IModules
): ITypecheck {
  const errors = {};
  if (brick instanceof Invocation) {
    const inputConfig = brick.getInputConfiguration(library, modules);
    keys(brick.inputs).map((key) => {
      const input = brick.inputs[key];
      const expectedType = (inputConfig.find(item => item.key === key) as any).type;
      const error = input.typeErrorForExpectedType(expectedType, library, modules);
      if (error) {
        errors[input.uniqueId] = error;
      }
      // TODO: now, call this function on the input and extend more errors.
    })
  }
  return errors;
}
import { ILibrary, IModules } from "./Types";
// import { isEqual } from "lodash";
import { Brick } from "./Brick";
import { Invocation } from "./Invocation";

interface ITypeError {
  code: string;
  message: string;
}

interface ITypecheck {
  [key: string]: ITypeError;
}

export function checkTypes(
  brick: Brick,
  library: ILibrary,
  modules: IModules
): ITypecheck {
  // const inputs = tower.inputs;

  // for each of this tower's inputs:
  // compare the socket's expected type with the actual type
  // if different, append information to the error set
  // now, call this function on the input and extend more errors.
  return {};
}

export function checkTypesForInvocation(
  invocation: Invocation,
  library: ILibrary,
  modules: IModules,
  typecheck: ITypecheck // this gets mutated
) {
  return null;
  // const inputConfigs = invocation.getInputConfiguration(library, modules);
  // const inputs = invocation.getOrderedInputs(library, modules);
  // inputConfigs.forEach((input, i) => {
  //   isEqual(input.type, inputs[i]);
  //   input.type;
  // });
}

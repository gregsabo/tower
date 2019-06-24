import { ITower, ILibrary, IModules } from "./Types";
import { isEqual } from "lodash";
import { Invocation } from "./Invocation";

interface ITypeError {
  code: string;
  message: string;
}

interface ITypecheck {
  [key: string]: ITypeError;
}

export function checkTypes(
  tower: ITower,
  library: ILibrary,
  modules: IModules
): ITypecheck {
  // Recurse from the root upwards
  // For each brick, check that each input's type matches
  // the actual brick's type.
  // If not, add an entry for the input brick's uniqueId.
  const inputs = tower.inputs;
  return {};
}

export function checkTypesForInvocation(
  invocation: Invocation,
  library: ILibrary,
  modules: IModules,
  typecheck: ITypecheck // this gets mutated
) {
  const inputConfigs = invocation.getInputConfiguration(library, modules);
  const inputs = invocation.getOrderedInputs(library, modules);
  inputConfigs.forEach((input, i) => {
    isEqual(input.type, inputs[i]);
    input.type;
  });
}

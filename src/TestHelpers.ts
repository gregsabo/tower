import { parseLiteral } from "./Parsing";
import {
  ITest,
  ITower,
  IInputConfiguration,
  TowerPrimitive,
} from "./Types";

export function makeOrderedValues(
  brick: ITower,
  test: ITest
): TowerPrimitive[] {
  return brick.inputs.map((inputConfig: IInputConfiguration) => {
    return parseLiteral(test.inputs[inputConfig.key] || "");
  });
}

export function makeInputNumMap(brick: ITower): { [key: string]: number } {
  const map = {};
  brick.inputs.map((inputConfig: IInputConfiguration, i: number) => {
    map[inputConfig.key] = i;
  });
  return map;
}

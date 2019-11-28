import { Brick } from "./Brick";
import { ITowerType } from "./ITowerType";

export interface ITest {
  inputs: { [key: string]: string };
  expected: string;
}

export interface IInputConfiguration {
  key: string;
  displayName: string;
  type?: ITowerType;
}

export interface ILibraryBrickWithImplementation {
  implementation: any;
  inputs: IInputConfiguration[];
  name: string;
}

export interface IGeneratingLibraryBrick {
  invocationGenerator: () => ILibraryBrickWithImplementation;
  name: string;
}

export interface IModuleLibraryBrick {
  moduleKey: ModuleKey;
  towerKey: TowerKey;
}

export type ILibraryBrick =
  | ILibraryBrickWithImplementation
  | IGeneratingLibraryBrick
  | IModuleLibraryBrick;

export type LibraryKey = string;
export interface ILibrary {
  [key: string]: ILibraryBrick;
}

export type InvocationKeyType = UniqueId;

export type ModuleKey = string;
export type TowerKey = string;
export type UniqueId = string;
export type ImplementationKey = string;

export type TowerPrimitive = string | boolean | number | ITowerPrimitiveArray;

interface ITowerPrimitiveArray extends Array<TowerPrimitive> {}

export type BrickTypeName =
  | "input"
  | "cork"
  | "invocation"
  | "constant"
  | "socket";

export interface ITower {
  rootBrick: Brick | null;
  towerKey: TowerKey;
  moduleKey: ModuleKey;
  name: string;
  inputs: IInputConfiguration[];
  tests: ITest[];
}

export interface IModule {
  towers: {
    [key: string]: ITower;
  };
}

export interface IModules {
  [key: string]: IModule;
}

export type EditorMode =
  | "cursor"
  | "insert"
  | "constant"
  | "test"
  | "naming"
  | "parameter";

export interface IParameterEditingState {
  mode: "naming" | "cursor";
  key: string;
}

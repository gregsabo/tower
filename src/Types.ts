import { Brick } from "./Brick";

export interface ITest {
  inputs: { [key: string]: string };
  expected: string;
}

export interface IInputConfiguration {
  key: string;
  displayName: string;
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
  brickKey: BrickKey;
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
export type BrickKey = string;
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
  rootBrick: Brick;
  brickKey: BrickKey;
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

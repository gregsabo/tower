import { Brick } from "./Brick";

export interface ITest {
  args: string[];
  expected: string;
}

export interface ILibraryBrickWithImplementation {
  implementation: any;
  numArgs: number;
  isEager?: boolean;
  isLazy?: boolean;
  name: string;
}

export interface IGeneratingLibraryBrick {
  invocationGenerator: () => ILibraryBrickWithImplementation;
  isEager?: boolean;
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
  | "arg"
  | "cork"
  | "invocation"
  | "constant"
  | "socket";

export interface ITower {
  rootBrick: Brick;
  brickKey: BrickKey;
  moduleKey: ModuleKey;
  name: string;
  numArgs: number;
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

export type EditorMode = "cursor" | "insert" | "constant" | "test" | "naming";

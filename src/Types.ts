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

export interface IInvocation extends ITowerType {
  args: Placeable[];
  implementationKey: ImplementationKey;
}

export interface ISocket {
  uniqueId: InvocationKeyType;
}

export type ModuleKey = string;
export type BrickKey = string;
export type UniqueId = string;
export type ImplementationKey = string;
export type TowerPrimitive =
  | string
  | boolean
  | number
  | string[]
  | boolean[]
  | number[];

type TowerPrimitive = string | boolean | number | ITowerPrimitiveArray;

interface ITowerPrimitiveArray extends Array<TowerPrimitive> {}

export interface ITowerType {
  uniqueId: UniqueId;
  types: string[];
}

export interface IBrick {
  rootInvocation: Placeable;
  brickKey: BrickKey;
  moduleKey: ModuleKey;
  name: string;
  numArgs: number;
  tests: ITest[];
}

export interface IArg extends ITowerType {}

export interface ICork extends ITowerType {}

export interface IConstant extends ITowerType {
  value: TowerPrimitive;
}

export type Placeable = IInvocation | IArg | ICork | IConstant;

export interface IModule {
  bricks: {
    [key: string]: IBrick;
  };
}

export interface IModules {
  [key: string]: IModule;
}

export type EditorMode = "cursor" | "insert" | "constant" | "test" | "naming";

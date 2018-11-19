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

export type ILibraryBrick = ILibraryBrickWithImplementation | IGeneratingLibraryBrick | IModuleLibraryBrick;

export type LibraryKey = string;
export interface ILibrary {
    [key: string]: ILibraryBrick;
}

export type InvocationKeyType = UniqueId;

export interface IInvocation {
    args: IInvocation[];
    implementationKey: ImplementationKey;
    uniqueId: InvocationKeyType;
}

export interface ISocket {
    uniqueId: InvocationKeyType;
}

export interface IConstant {
    uniqueId: InvocationKeyType;
    value: TowerPrimitive;
}

export type ModuleKey = string;
export type BrickKey = string;
export type UniqueId = string;
export type ImplementationKey = string;
export type TowerPrimitive = string | boolean | number | string[] | boolean[] | number[]

type TowerPrimitive = string | boolean | number | ITowerPrimitiveArray

interface ITowerPrimitiveArray extends Array<TowerPrimitive> {}

export interface IBrick {
    rootInvocation: IInvocation
    brickKey: BrickKey,
    moduleKey: ModuleKey,
    name: string,
    numArgs: number,
    tests: ITest[]
}

export interface IArg {
    uniqueId: UniqueId;
}

export interface ICork {
    uniqueId: UniqueId;
}

export interface IModule {
    bricks: {
        [key: string]: IBrick;
    }
}

export interface IModules {
    [key: string]: IModule
}

export type EditorMode = "cursor" | "insert" | "constant" | "test" | "naming";

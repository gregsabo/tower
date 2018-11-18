export interface ITest {
    args: string[],
    expected: string
}

export type InvocationKeyType = UniqueId;

export interface IInvocation {
    args: IInvocation[],
    implementationKey: ImplementationKey,
    uniqueId: InvocationKeyType;
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

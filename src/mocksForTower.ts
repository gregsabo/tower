import { ITower, ILibrary, IModules, UniqueId, IInputConfiguration } from "./Types";
import { Invocation } from "./Invocation";
import mapInvocations from "./mapInvocations";
import { ITowerType, t, STR } from "./ITowerType";

// A mock signature represents all of the fields needed
// to simulate a given brick.
export interface IMockSignature {
    uniqueId: UniqueId;
    displayName: string;
    inputs: IInputConfiguration[];
    output: ITowerType;
}

export default function mocksForTower(tower: ITower, library: ILibrary, modules: IModules): IMockSignature[] {
    if (tower.rootBrick instanceof Invocation) {
        const mocks : IMockSignature[] = [];
        mapInvocations(tower.rootBrick, (invocation: Invocation) => {
            if (invocationPerformsIO(invocation, [], library, modules)) {
                mocks.push({
                    uniqueId: invocation.uniqueId,
                    displayName: invocation.getName(library, modules),
                    inputs: invocation.getInputConfiguration(library, modules),
                    output: t(STR)
                })
            }
        }, library, modules)
        return mocks;
    } else {
        return [];
    }
}

function invocationPerformsIO(invocation: Invocation, visited: UniqueId[], library: ILibrary, modules: IModules): boolean {
    const libraryFunction = invocation.libraryFunction(library, modules);
    if (libraryFunction.rootBrick) {
        let ioDetected = false;
        mapInvocations(libraryFunction.rootBrick, (subInvocation: Invocation) => {
            if (ioDetected) {
                return;
            }
            if (visited.indexOf(subInvocation.uniqueId) > -1) {
                return;
            }
            if (invocationPerformsIO(subInvocation, visited.concat([subInvocation.uniqueId]), library, modules)) {
                ioDetected = true;
            }
        }, library, modules);
        return ioDetected;
    } else {
        return Boolean(libraryFunction.performsIO);
    }
}
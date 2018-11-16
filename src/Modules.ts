import Socket from "./Socket";

export function makeLibraryKey(moduleKey: any, brickKey: any) {
    return moduleKey + "::" + brickKey;
}

export function importModulesIntoLibrary(modules: any, library: any) {
    Object.keys(modules).map((moduleKey) => {
        const bricks = modules[moduleKey].bricks;
        Object.keys(bricks).map((brickKey) => {
            library[makeLibraryKey(moduleKey, brickKey)] = {
                brickKey,
                moduleKey
            };
        });
    });
}

export function getBrickFromModules(moduleKey: string, brickKey: string, modules: any) {
    return modules[moduleKey].bricks[brickKey];
}

export function maybeLookUpModule(libraryItem: any, modules: object) {
    if (libraryItem.moduleKey && libraryItem.brickKey) {
        return getBrickFromModules(
            libraryItem.moduleKey,
            libraryItem.brickKey,
            modules
        );
    } else {
        return libraryItem;
    }
}

export function createNewBrick(moduleKey: string, modules: any) {
    const newBrickId = String(Math.random());
    modules[moduleKey].bricks[newBrickId] = {
        brickKey: newBrickId,
        moduleKey,
        name: `New Brick ${newBrickId}`,
        numArgs: 1,
        rootInvocation: Socket.create({}),
        tests: []
    };
    return makeLibraryKey(moduleKey, newBrickId);
}

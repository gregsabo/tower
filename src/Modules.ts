import Socket from './Socket';
import { ILibrary, IModules, BrickKey, ModuleKey } from './Types';

export function makeLibraryKey(moduleKey: ModuleKey, brickKey: BrickKey) {
  return moduleKey + '::' + brickKey;
}

export function importModulesIntoLibrary(modules: IModules, library: ILibrary) {
  Object.keys(modules).map(moduleKey => {
    const bricks = modules[moduleKey].bricks;
    Object.keys(bricks).map(brickKey => {
      library[makeLibraryKey(moduleKey, brickKey)] = {
        brickKey,
        moduleKey
      };
    });
  });
}

export function getBrickFromModules(
  moduleKey: ModuleKey,
  brickKey: BrickKey,
  modules: IModules
) {
  return modules[moduleKey].bricks[brickKey];
}

export function maybeLookUpModule(libraryItem: any, modules: IModules) {
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

export function createNewBrick(moduleKey: ModuleKey, modules: IModules) {
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

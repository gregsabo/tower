import { Socket } from "./Socket";
import { IModules, BrickKey, ModuleKey } from "./Types";

export function makeLibraryKey(moduleKey: ModuleKey, brickKey: BrickKey) {
  return moduleKey + "::" + brickKey;
}

export function importModulesIntoLibrary(modules: IModules, library: any) {
  Object.keys(modules).map(moduleKey => {
    const bricks = modules[moduleKey].towers;
    Object.keys(bricks).map(brickKey => {
      library[makeLibraryKey(moduleKey, brickKey)] = {
        brickKey,
        moduleKey
      };
    });
  });
}

export function getTowerFromModules(
  moduleKey: ModuleKey,
  brickKey: BrickKey,
  modules: IModules
) {
  return modules[moduleKey].towers[brickKey];
}

export function maybeLookUpModule(libraryItem: any, modules: IModules) {
  if (libraryItem.moduleKey && libraryItem.brickKey) {
    return getTowerFromModules(
      libraryItem.moduleKey,
      libraryItem.brickKey,
      modules
    );
  } else {
    return libraryItem;
  }
}

export function createNewTower(moduleKey: ModuleKey, modules: IModules) {
  const newBrickId = String(Math.random());
  modules[moduleKey].towers[newBrickId] = {
    brickKey: newBrickId,
    moduleKey,
    name: `New Tower ${newBrickId}`,
    inputs: [],
    rootBrick: new Socket(),
    tests: []
  };
  return makeLibraryKey(moduleKey, newBrickId);
}

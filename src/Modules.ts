import { IModules, TowerKey, ModuleKey } from "./Types";

export function makeLibraryKey(moduleKey: ModuleKey, towerKey: TowerKey) {
  return moduleKey + "::" + towerKey;
}

export function importModulesIntoLibrary(modules: IModules, library: any) {
  Object.keys(modules).map(moduleKey => {
    const bricks = modules[moduleKey].towers;
    Object.keys(bricks).map(towerKey => {
      library[makeLibraryKey(moduleKey, towerKey)] = {
        towerKey,
        moduleKey
      };
    });
  });
}

export function getTowerFromModules(
  moduleKey: ModuleKey,
  towerKey: TowerKey,
  modules: IModules
) {
  return modules[moduleKey].towers[towerKey];
}

export function maybeLookUpModule(libraryItem: any, modules: IModules) {
  if (libraryItem.moduleKey && libraryItem.towerKey) {
    return getTowerFromModules(
      libraryItem.moduleKey,
      libraryItem.towerKey,
      modules
    );
  } else {
    return libraryItem;
  }
}

export function createNewTower(moduleKey: ModuleKey, modules: IModules) {
  const newBrickId = String(Math.random());
  modules[moduleKey].towers[newBrickId] = {
    towerKey: newBrickId,
    moduleKey,
    name: `New Tower ${newBrickId}`,
    inputs: [],
    rootBrick: null,
    tests: []
  };
  return makeLibraryKey(moduleKey, newBrickId);
}

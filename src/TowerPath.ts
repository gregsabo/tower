// Path
// Represents a Path through a Tower, from the root up
// traversing through a set of invocation inputs.

import { isEqual, get, set, unset } from "lodash";
import { Brick } from "./Brick";
import { ITower } from "./Types";

export default class TowerPath {
  public static forRoot() {
    return new TowerPath();
  }

  private pathStrings: string[];

  constructor(pathStrings: string[] = []) {
    this.pathStrings = pathStrings;
  }

  public plus(component: string) {
    return new TowerPath(this.pathStrings.concat([component]));
  }

  public parent() {
    const penultimateIndex = this.pathStrings.length - 1;
    return new TowerPath(this.pathStrings.slice(0, penultimateIndex));
  }

  public equals(other: TowerPath | null) {
    if (!other) {
      return false;
    }
    return isEqual(this.pathStrings, other.pathStrings);
  }

  public isRoot() {
    return isEqual(this.pathStrings, []);
  }

  public finalComponent(): string {
    return this.pathStrings[this.pathStrings.length - 1];
  }

  public get(tower: ITower): Brick {
    if (this.isRoot() && tower.rootBrick) {
      return tower.rootBrick;
    }
    return get(tower.rootBrick, this.lodashPath());
  }

  public replace(tower: ITower, brick: Brick) {
    if (this.isRoot()) {
      tower.rootBrick = brick;
      return;
    }
    if (tower.rootBrick !== null) {
      set(tower.rootBrick, this.lodashPath(), brick);
    }
  }

  public delete(tower: ITower) {
    if (this.isRoot()) {
      tower.rootBrick = null;
      return;
    }
    unset(tower.rootBrick, this.lodashPath());
  }

  private lodashPath() {
    const joined = this.pathStrings.join(".inputs.");
    if (joined.length > 0) {
      return "inputs." + joined;
    } else {
      return joined;
    }
  }
}

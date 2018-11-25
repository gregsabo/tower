import { Placeable } from "./Types";

export class Sky {
  public capacity: number = 5;
  private memory: Placeable[] = [];

  constructor(capacity = 5) {
    this.capacity = capacity;
  }

  public moveIn(a: Placeable) {
    this.memory.unshift(a);
    while (this.memory.length > this.capacity) {
      this.memory.pop();
    }
  }

  public dropOut() {
    return this.memory.shift();
  }

  public peek() {
    if (this.memory.length === 0) {
      return null;
    }
    return this.memory[0];
  }

  public swap(a: Placeable) {
    const old = this.memory[0];
    this.memory[0] = a;
    return old;
  }
}

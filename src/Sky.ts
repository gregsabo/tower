import { Brick } from "./Brick";

export class Sky {
  public capacity: number = 5;
  private memory: Brick[] = [];

  constructor(capacity = 5) {
    this.capacity = capacity;
  }

  public moveIn(a: Brick) {
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

  public swap(a: Brick) {
    const old = this.memory[0];
    this.memory[0] = a;
    return old;
  }

  public clear() {
    this.memory = [];
  }
}

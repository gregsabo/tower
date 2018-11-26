import { Arg } from "./Arg";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import LazyValue from "./LazyValue";

const Library = {
  add: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() + b.get(),
    isEager: true,
    name: "add",
    numArgs: 2
  },
  and: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() && b.get(),
    isEager: true,
    name: "and",
    numArgs: 2
  },
  arg: {
    invocationGenerator: () => new Arg(),
    isEager: true,
    name: "arg"
  },
  capitalize: {
    implementation: (lazyA: LazyValue) => {
      const a = lazyA.get();
      if (a.length === 0) {
        return a;
      } else {
        return a[0].toUpperCase() + a.slice(1);
      }
    },
    isEager: true,
    name: "capitalize",
    numArgs: 1
  },
  concat: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() + b.get(),
    isEager: true,
    name: "concat",
    numArgs: 2
  },
  cork: {
    invocationGenerator: () => new Cork(),
    isEager: true,
    name: "cork"
  },
  equals: {
    implementation: (a: LazyValue, b: LazyValue) => {
      return a.get() === b.get();
    },
    isEager: true,
    name: "equals?",
    numArgs: 2
  },
  ifThenElse: {
    implementation: (
      cond: LazyValue,
      ifTrue: LazyValue,
      ifFalse: LazyValue
    ) => {
      if (cond.get()) {
        return ifTrue.get();
      } else {
        return ifFalse.get();
      }
    },
    isLazy: true,
    name: "if",
    numArgs: 3
  },
  join: {
    implementation: (a: LazyValue, b: LazyValue) => a.get().join(b.get()),
    isEager: true,
    name: "join",
    numArgs: 2
  },
  lessOrEquals: {
    implementation: (a: LazyValue, b: LazyValue) => {
      return a.get() <= b.get();
    },
    isEager: true,
    name: "less than or equal?",
    numArgs: 2
  },
  map: {
    implementation: (a: LazyValue, func: LazyValue) => a.get().map(func.get()),
    isEager: true,
    name: "map",
    numArgs: 2
  },
  mo: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() % b.get(),
    isEager: true,
    name: "modulo",
    numArgs: 2
  },
  multiply: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() * b.get(),
    isEager: true,
    name: "multiply",
    numArgs: 2
  },
  newBrick: {
    implementation: () => new Error("Uninitialized brick"),
    isEager: true,
    name: "newBrick",
    numArgs: 0
  },
  numberLiteral: {
    invocationGenerator: () => {
      const givenString = window.prompt("Enter the float.");
      if (givenString === null) {
        return new Constant({ value: 0 });
      }
      const given = Number.parseFloat(givenString);
      if (Number.isNaN(given)) {
        return new Constant({ value: 0 });
      }
      return new Constant({ value: given });
    },
    isEager: true,
    name: "number"
  },
  range: {
    implementation: (a: LazyValue) => {
      const outArray = [];
      // Purposefully starting from 1.
      for (let i = 1; i <= a.get(); i++) {
        outArray.push(i);
      }
      return outArray;
    },
    isEager: true,
    name: "range",
    numArgs: 1
  },
  split: {
    implementation: (a: LazyValue) => a.get().split(" "),
    isEager: true,
    name: "split",
    numArgs: 1
  },
  stringLiteral: {
    invocationGenerator: () =>
      new Constant({ value: window.prompt("Enter the string.") || "" }),
    isEager: true,
    name: "string"
  },
  subtract: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() - b.get(),
    isEager: true,
    name: "subtract",
    numArgs: 2
  }
};

export default Library;

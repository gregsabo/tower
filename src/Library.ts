import { Input } from "./Input";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import LazyValue from "./LazyValue";

const Library = {
  add: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() + b.get(),
    isEager: true,
    name: "add",
    numInputs: 2
  },
  and: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() && b.get(),
    isEager: true,
    name: "and",
    numInputs: 2
  },
  arg: {
    invocationGenerator: () => new Input(),
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
    numInputs: 1
  },
  concat: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() + b.get(),
    isEager: true,
    name: "concat",
    numInputs: 2
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
    numInputs: 2
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
    numInputs: 3
  },
  join: {
    implementation: (a: LazyValue, b: LazyValue) => a.get().join(b.get()),
    isEager: true,
    name: "join",
    numInputs: 2
  },
  lessOrEquals: {
    implementation: (a: LazyValue, b: LazyValue) => {
      return a.get() <= b.get();
    },
    isEager: true,
    name: "less than or equal?",
    numInputs: 2
  },
  map: {
    implementation: (a: LazyValue, func: LazyValue) => a.get().map(func.get()),
    isEager: true,
    name: "map",
    numInputs: 2
  },
  mo: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() % b.get(),
    isEager: true,
    name: "modulo",
    numInputs: 2
  },
  multiply: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() * b.get(),
    isEager: true,
    name: "multiply",
    numInputs: 2
  },
  newBrick: {
    implementation: () => new Error("Uninitialized brick"),
    isEager: true,
    name: "newBrick",
    numInputs: 0
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
    numInputs: 1
  },
  split: {
    implementation: (a: LazyValue) => a.get().split(" "),
    isEager: true,
    name: "split",
    numInputs: 1
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
    numInputs: 2
  }
};

export default Library;

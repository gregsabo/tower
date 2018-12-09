import { Input } from "./Input";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import LazyValue from "./LazyValue";
import { makeUniqueId } from "./MakeUniqueId";

const Library = {
  add: {
    implementation: ({ a, b }: { a: LazyValue; b: LazyValue }) => {
      return a.get() + b.get();
    },
    name: "add",
    inputs: [
      {
        key: "a",
        displayName: "a"
      },
      {
        key: "b",
        displayName: "b"
      }
    ]
  },
  and: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() && b.get(),
    name: "and",
    inputs: [
      {
        key: "a",
        displayName: "a"
      },
      {
        key: "b",
        displayName: "b"
      }
    ]
  },
  input: {
    invocationGenerator: () => new Input({ inputKey: makeUniqueId() }),
    name: "input"
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
    inputs: [
      {
        key: "a",
        displayName: "input string"
      }
    ],
    name: "capitalize"
  },
  concat: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() + b.get(),
    inputs: [
      {
        key: "a",
        displayName: "a"
      },
      {
        key: "b",
        displayName: "b"
      }
    ],
    name: "concat"
  },
  cork: {
    invocationGenerator: () => new Cork(),
    name: "cork"
  },
  equals: {
    implementation: (a: LazyValue, b: LazyValue) => {
      return a.get() === b.get();
    },
    inputs: [
      {
        key: "a",
        displayName: "a"
      },
      {
        key: "b",
        displayName: "b"
      }
    ],
    name: "equals?"
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
    inputs: [
      {
        key: "if",
        displayName: "if"
      },
      {
        key: "then",
        displayName: "then"
      },
      {
        key: "else",
        displayName: "else"
      }
    ],
    name: "if"
  },
  join: {
    implementation: (a: LazyValue, b: LazyValue) => a.get().join(b.get()),
    inputs: [
      {
        key: "a",
        displayName: "list"
      },
      {
        key: "b",
        displayName: "connector"
      }
    ],
    name: "join"
  },
  lessOrEquals: {
    implementation: (a: LazyValue, b: LazyValue) => {
      return a.get() <= b.get();
    },
    inputs: [
      {
        key: "a",
        displayName: "a"
      },
      {
        key: "b",
        displayName: "b"
      }
    ],
    name: "less than or equal?"
  },
  map: {
    implementation: ({ a, func }: { a: LazyValue; func: LazyValue }) => {
      return a.get().map(func.get());
    },
    inputs: [
      {
        key: "a",
        displayName: "list"
      },
      {
        key: "func",
        displayName: "corked brick"
      }
    ],
    name: "map"
  },
  mod: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() % b.get(),
    inputs: [
      {
        key: "a",
        displayName: "a"
      },
      {
        key: "b",
        displayName: "b"
      }
    ],
    name: "modulo"
  },
  multiply: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() * b.get(),
    inputs: [
      {
        key: "a",
        displayName: "a"
      },
      {
        key: "b",
        displayName: "b"
      }
    ],
    name: "multiply"
  },
  newBrick: {
    implementation: () => new Error("Uninitialized brick"),
    inputs: [],
    name: "newBrick"
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
    inputs: [
      {
        key: "max",
        displayName: "max"
      }
    ],
    name: "range"
  },
  split: {
    implementation: (a: LazyValue) => a.get().split(" "),
    inputs: [
      {
        key: "a",
        displayName: "input string"
      }
    ],
    name: "split"
  },
  stringLiteral: {
    invocationGenerator: () =>
      new Constant({ value: window.prompt("Enter the string.") || "" }),
    name: "string"
  },
  subtract: {
    implementation: (a: LazyValue, b: LazyValue) => a.get() - b.get(),
    inputs: [
      {
        key: "a",
        displayName: "a"
      },
      {
        key: "b",
        displayName: "b"
      }
    ],
    name: "subtract"
  }
};

export default Library;

import { Input } from "./Input";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import LazyValue from "./LazyValue";
import { makeUniqueId } from "./MakeUniqueId";
import { ITowerType, t, NUM, STR, BOOL, LIST, UNION, FUNC } from "./ITowerType";

interface IGeneratingLibraryEntry {
  invocationGenerator: any;
  name: string;
}

interface IImplementedLibraryEntry {
  name: string;
  implementation?: any;
  lazyImplementation?: any;
  performsIO?: boolean;
  returnType: ITowerType;
  inputs: Array<{ key: string; displayName: string; type: ITowerType }>;
}

type LibraryEntry = IGeneratingLibraryEntry | IImplementedLibraryEntry;

const Library: { [name: string]: LibraryEntry } = {
  add: {
    implementation: async (a: any, b: any) => {
      return a + b;
    },
    name: "add",
    returnType: t(NUM),
    inputs: [
      {
        key: "a",
        displayName: "a",
        type: t(NUM)
      },
      {
        key: "b",
        displayName: "b",
        type: t(NUM)
      }
    ]
  },
  and: {
    implementation: (a: any, b: any) => a + b,
    name: "and",
    returnType: t(BOOL),
    inputs: [
      {
        key: "a",
        displayName: "a",
        type: t(BOOL)
      },
      {
        key: "b",
        displayName: "b",
        type: t(BOOL)
      }
    ]
  },
  input: {
    invocationGenerator: () => new Input({ inputKey: makeUniqueId() }),
    name: "input"
  },
  capitalize: {
    implementation: (a: any) => {
      if (a.length === 0) {
        return a;
      } else {
        return a[0].toUpperCase() + a.slice(1);
      }
    },
    returnType: t(STR),
    inputs: [
      {
        key: "a",
        displayName: "input string",
        type: t(STR)
      }
    ],
    name: "capitalize"
  },
  concat: {
    implementation: (a: any, b: any) => a + b,
    returnType: t(STR),
    inputs: [
      {
        key: "a",
        displayName: "a",
        type: t(STR)
      },
      {
        key: "b",
        displayName: "b",
        type: t(STR)
      }
    ],
    name: "concat"
  },
  cork: {
    invocationGenerator: () => new Cork(),
    name: "cork"
  },
  divide: {
    implementation: (a: any, b: any) => a / b,
    returnType: t(NUM),
    inputs: [
      {
        key: "a",
        displayName: "dividend",
        type: t(NUM)
      },
      {
        key: "b",
        displayName: "divisor",
        type: t(NUM)
      }
    ],
    name: "divide"
  },
  equals: {
    implementation: (a: any, b: any) => a === b,
    returnType: t(BOOL),
    inputs: [
      {
        key: "a",
        displayName: "a",
        type: t(NUM)
      },
      {
        key: "b",
        displayName: "b",
        type: t(NUM)
      }
    ],
    name: "equals?"
  },
  floor: {
    implementation: (a: any) => Math.floor(a),
    returnType: t(NUM),
    inputs: [
      {
        key: "a",
        displayName: "Number",
        type: t(NUM)
      }
    ],
    name: "floor"
  },
  ifThenElse: {
    lazyImplementation: async (
      cond: LazyValue,
      ifTrue: LazyValue,
      ifFalse: LazyValue
    ) => {
      if (cond.get()) {
        return await ifTrue.get();
      } else {
        return await ifFalse.get();
      }
    },
    returnType: t(UNION, [1, 2]),
    inputs: [
      {
        key: "if",
        displayName: "if",
        type: t(BOOL)
      },
      {
        key: "then",
        displayName: "then",
        type: t(1)
      },
      {
        key: "else",
        displayName: "else",
        type: t(2)
      }
    ],
    name: "if"
  },
  join: {
    implementation: (a: any, b: any) => a.join(b),
    returnType: t(STR),
    inputs: [
      {
        key: "a",
        displayName: "list",
        type: t(LIST, [STR])
      },
      {
        key: "b",
        displayName: "connector",
        type: t(STR)
      }
    ],
    name: "join"
  },
  lessOrEquals: {
    implementation: (a: any, b: any) => a <= b,
    returnType: t(BOOL),
    inputs: [
      {
        key: "a",
        displayName: "a",
        type: t(BOOL)
      },
      {
        key: "b",
        displayName: "b",
        type: t(BOOL)
      }
    ],
    name: "less than or equal?"
  },
  map: {
    lazyImplementation: async (lazyList: LazyValue, lazyFunc: LazyValue) => {
      const list = await lazyList.get();
      const func = await lazyFunc.get();
      const outList = [];
      for (const item of list) {
        outList.push(await func(item));
      }
      return outList;
    },
    returnType: t(LIST, [2]),
    inputs: [
      {
        key: "a",
        displayName: "list",
        type: t(LIST, [1])
      },
      {
        key: "func",
        displayName: "corked brick",
        type: t(FUNC, [1, 2])
      }
    ],
    name: "map"
  },
  mod: {
    implementation: (a: any, b: any) => a % b,
    returnType: t(NUM),
    inputs: [
      {
        key: "a",
        displayName: "a",
        type: t(NUM)
      },
      {
        key: "b",
        displayName: "b",
        type: t(NUM)
      }
    ],
    name: "modulo"
  },
  multiply: {
    implementation: (a: any, b: any) => a * b,
    returnType: t(NUM),
    inputs: [
      {
        key: "a",
        displayName: "a",
        type: t(NUM)
      },
      {
        key: "b",
        displayName: "b",
        type: t(NUM)
      }
    ],
    name: "multiply"
  },
  newBrick: {
    invocationGenerator: () => null,
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
    implementation: (a: any) => {
      const outArray = [];
      // Purposefully starting from 1.
      for (let i = 1; i <= a; i++) {
        outArray.push(i);
      }
      return outArray;
    },
    returnType: t(LIST, [NUM]),
    inputs: [
      {
        key: "max",
        displayName: "max",
        type: t(NUM)
      }
    ],
    name: "range"
  },
  split: {
    implementation: (a: any) => a.split(" "),
    returnType: t(LIST, [STR]),
    inputs: [
      {
        key: "a",
        displayName: "input string",
        type: t(STR)
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
    implementation: (a: any, b: any) => a - b,
    returnType: t(NUM),
    inputs: [
      {
        key: "a",
        displayName: "a",
        type: t(NUM)
      },
      {
        key: "b",
        displayName: "b",
        type: t(NUM)
      }
    ],
    name: "subtract"
  },
  time: {
    implementation: () => new Date().getTime(),
    performsIO: true,
    returnType: t(NUM),
    inputs: [],
    name: "time"
  }
};

export default Library;

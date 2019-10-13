import { Input } from "./Input";
import { Constant } from "./Constant";
import { Cork } from "./Cork";
import LazyValue from "./LazyValue";
import { makeUniqueId } from "./MakeUniqueId";

type TypeName = string | number;

interface ITowerType {
  typeName: TypeName;
  typeParameters?: TypeName[];
}

const NUM = "number";
const STR = "string";
const BOOL = "boolean";
const LIST = "list";
const UNION = "union";
const FUNC = "function";

function t(typeName: TypeName, parameters?: TypeName[]) {
  return {
    typeName,
    typeParameters: parameters
  };
}

interface IGeneratingLibraryEntry {
  invocationGenerator: any;
  name: string;
}

interface IImplementedLibraryEntry {
  name: string;
  implementation: any;
  returnType: ITowerType;
  inputs: Array<{ key: string; displayName: string; type: ITowerType }>;
}

type LibraryEntry = IGeneratingLibraryEntry | IImplementedLibraryEntry;

const Library: { [name: string]: LibraryEntry } = {
  add: {
    implementation: (a: LazyValue, b: LazyValue) => {
      console.log("About to add", a.get(), b.get());
      return a.get() + b.get();
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
    implementation: (a: LazyValue, b: LazyValue) => a.get() && b.get(),
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
    implementation: (a: LazyValue) => {
      if (a.get().length === 0) {
        return a.get();
      } else {
        return a.get()[0].toUpperCase() + a.get().slice(1);
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
    implementation: (a: LazyValue, b: LazyValue) => a.get() + b.get(),
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
  equals: {
    implementation: (a: LazyValue, b: LazyValue) => {
      return a.get() === b.get();
    },
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
    implementation: (a: LazyValue, b: LazyValue) => {
      return a.get().join(b.get());
    },
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
    implementation: (a: LazyValue, b: LazyValue) => {
      return a.get() <= b.get();
    },
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
    implementation: (a: LazyValue, func: LazyValue) => {
      console.log("About to map over", a.get());
      return a.get().map(func.get());
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
    implementation: (a: LazyValue, b: LazyValue) => a.get() % b.get(),
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
    implementation: (a: LazyValue, b: LazyValue) => a.get() * b.get(),
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
    implementation: (a: LazyValue) => {
      const outArray = [];
      // Purposefully starting from 1.
      for (let i = 1; i <= a.get(); i++) {
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
    implementation: (a: LazyValue) => a.get().split(" "),
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
    implementation: (a: LazyValue, b: LazyValue) => a.get() - b.get(),
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
  }
};

export default Library;

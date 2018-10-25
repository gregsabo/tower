import Arg from "./Arg";
import Constant from "./Constant";
import Cork from "./Cork";

const Library = {
    add: {
        implementation: (a: any, b: any) => a + b,
        isLazy: false,
        name: "add",
        numArgs: 2
    },
    arg: {
        invocationGenerator: () => new Arg(),
        isLazy: false,
        name: "arg"
    },
    capitalize: {
        implementation: (a: string) => {
            if (a.length === 0) {
                return a;
            } else {
                return a[0].toUpperCase() + a.slice(1);
            }
        },
        isLazy: false,
        name: "capitalize",
        numArgs: 1
    },
    concat: {
        implementation: (a: string, b: string) => a + b,
        isLazy: false,
        name: "concat",
        numArgs: 2
    },
    cork: {
        invocationGenerator: () => new Cork(),
        isLazy: false,
        name: "cork"
    },
    equals: {
        implementation: (a: any, b: any) => a === b,
        isLazy: false,
        name: "equals?",
        numArgs: 2
    },
    fib: {
        implementation: (a: any) => a * 2,
        isLazy: false,
        name: "fib",
        numArgs: 1
    },
    ifThenElse: {
        implementation: (cond: any, ifTrue: any, ifFalse: any) => {
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
        implementation: (a: [string], b: string) => a.join(b),
        isLazy: false,
        name: "join",
        numArgs: 2
    },
    map: {
        implementation: (a: [any], func: any) => a.map(func),
        isLazy: false,
        name: "map",
        numArgs: 2
    },
    multiply: {
        implementation: (a: any, b: any) => a * b,
        isLazy: false,
        name: "multiply",
        numArgs: 2
    },
    numberLiteral: {
        invocationGenerator: () => {
            const givenString = window.prompt("Enter the float.");
            if (givenString === null) {
                return new Constant(0);
            }
            const given = Number.parseFloat(givenString);
            if (Number.isNaN(given)) {
                return new Constant(0);
            }
            return new Constant(given);
        },
        isLazy: false,
        name: "number"
    },
    split: {
        implementation: (a: any) => a.split(" "),
        isLazy: false,
        name: "split",
        numArgs: 1
    },
    stringLiteral: {
        invocationGenerator: () => new Constant(window.prompt("Enter the string.")),
        isLazy: false,
        name: "string"
    },
    subtract: {
        implementation: (a: any, b: any) => a - b,
        isLazy: false,
        name: "subtract",
        numArgs: 2
    }
};

export default Library;

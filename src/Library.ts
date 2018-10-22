import Arg from "./Arg";
import Constant from "./Constant";
import Cork from "./Cork";

const Library = {
    add: {
        implementation: (a: any, b: any) => a + b,
        name: "add",
        numArgs: 2
    },
    arg: {
        invocationGenerator: () => new Arg(),
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
        name: "capitalize",
        numArgs: 1
    },
    concat: {
        implementation: (a: string, b: string) => a + b,
        name: "concat",
        numArgs: 2
    },
    cork: {
        invocationGenerator: () => new Cork(),
        name: "cork"
    },
    equals: {
        implementation: (a: any, b: any) => a === b,
        name: "equals?",
        numArgs: 2
    },
    fib: {
        implementation: (a: any) => a * 2,
        name: "fib",
        numArgs: 1
    },
    ifThenElse: {
        implementation: (cond: any, ifTrue: any, ifFalse: any) => {
            // TODO: actually do conditional evaluation
            if (cond) {
                return ifTrue;
            } else {
                return ifFalse;
            }
        },
        name: "if",
        numArgs: 3
    },
    join: {
        implementation: (a: [string], b: string) => a.join(b),
        name: "join",
        numArgs: 2
    },
    map: {
        implementation: (a: [any], func: any) => a.map(func),
        name: "map",
        numArgs: 2
    },
    multiply: {
        implementation: (a: any, b: any) => a * b,
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
        name: "number"
    },
    split: {
        implementation: (a: string) => a.split(" "),
        name: "split",
        numArgs: 1
    },
    stringLiteral: {
        invocationGenerator: () => new Constant(window.prompt("Enter the string.")),
        name: "string"
    },
    subtract: {
        implementation: (a: any, b: any) => a - b,
        name: "subtract",
        numArgs: 2
    }
};

export default Library;

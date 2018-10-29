import Arg from "./Arg";
import Constant from "./Constant";
import Cork from "./Cork";

const Library = {
    add: {
        implementation: (a: any, b: any) => a.get() + b.get(0),
        isEager: true,
        name: "add",
        numArgs: 2
    },
    arg: {
        invocationGenerator: () => new Arg(),
        isEager: true,
        name: "arg"
    },
    capitalize: {
        implementation: (lazyA: any) => {
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
        implementation: (a: any, b: any) => a.get() + b.get(),
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
        implementation: (a: any, b: any) => {
            return a.get() === b.get();
        },
        isEager: true,
        name: "equals?",
        numArgs: 2
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
        implementation: (a: any, b: any) => a.get().join(b.get()),
        isEager: true,
        name: "join",
        numArgs: 2
    },
    lessOrEquals: {
        implementation: (a: any, b: any) => {
            return a.get() <= b.get();
        },
        isEager: true,
        name: "less than or equal?",
        numArgs: 2
    },
    map: {
        implementation: (a: any, func: any) => a.get().map(func.get()),
        isEager: true,
        name: "map",
        numArgs: 2
    },
    multiply: {
        implementation: (a: any, b: any) => a.get() * b.get(),
        isEager: true,
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
        isEager: true,
        name: "number"
    },
    split: {
        implementation: (a: any) => a.get().split(" "),
        isEager: true,
        name: "split",
        numArgs: 1
    },
    stringLiteral: {
        invocationGenerator: () => new Constant(window.prompt("Enter the string.")),
        isEager: true,
        name: "string"
    },
    subtract: {
        implementation: (a: any, b: any) => a.get() - b.get(),
        isEager: true,
        name: "subtract",
        numArgs: 2
    }
};

export default Library;

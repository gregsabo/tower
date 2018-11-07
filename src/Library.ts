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
        invocationGenerator: () => Arg.create({}),
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
        invocationGenerator: () => Cork.create({}),
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
                return Constant.create({value: 0});
            }
            const given = Number.parseFloat(givenString);
            if (Number.isNaN(given)) {
                return Constant.create({value: 0});
            }
            return Constant.create({value: given});
        },
        isEager: true,
        name: "number"
    },
    range: {
        implementation: (a: any) => {
            const outArray = [];
            for (let i = 1; i <= a; i++) {
                outArray.push(i);
            }
            return outArray;
        },
        isEager: true,
        name: "range",
        numArgs: 1
    },
    split: {
        implementation: (a: any) => a.get().split(" "),
        isEager: true,
        name: "split",
        numArgs: 1
    },
    stringLiteral: {
        invocationGenerator: () => Constant.create({value: window.prompt("Enter the string.")}),
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

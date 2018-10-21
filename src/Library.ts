import Arg from "./Arg";
import Constant from "./Constant";
import Cork from "./Cork";

const Library = {
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
    split: {
        implementation: (a: string) => a.split(" "),
        name: "split",
        numArgs: 1
    },
    stringLiteral: {
        invocationGenerator: () => new Constant(window.prompt("Enter the string.")),
        name: "string"
    }
};

export default Library;

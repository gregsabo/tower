const Library = {
    capitalize: {
        implementation: (a: string) => a[0].toUpperCase + a.slice(1),
        name: "capitalize",
        numArgs: 1
    },
    concat: {
        implementation: (a: string, b: string) => a + b,
        name: "concat",
        numArgs: 2
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
        implementation: (a: string) => a.split,
        name: "split",
        numArgs: 1
    }
};

export default Library;

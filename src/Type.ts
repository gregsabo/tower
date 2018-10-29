export default function makeType(name: string) {
    return {
        create: () => {
            return {
                types: [name],
                uniqueId: String(Math.random())
            };
        },
        describes: (inObject: any) => {
            return inObject &&
                inObject.types &&
                Array.isArray(inObject.types) &&
                inObject.types.indexOf(name) > -1;
        },
        name
    };
}

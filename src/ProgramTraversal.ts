function findById(program: any, uniqueId: string) {
    if (program.uniqueId === uniqueId) {
        return {
            invocation: program,
            path: []
        };
    }
    return recurseFind(
        program,
        uniqueId,
        []
    );
}

function recurseFind(program: any, uniqueId: string, path: any): any {
    if (program.args === undefined)  {
        return false;
    }
    for (const arg of program.args) {
        if (arg.uniqueId === uniqueId) {
            return {
                invocation: arg,
                path: path.concat([program])
            };
        }
        const found = recurseFind(
            arg,
            uniqueId,
            path.concat([program])
        );
        if (found) {
            return found;
        }
    }
    return false;
}

export {
    findById
}

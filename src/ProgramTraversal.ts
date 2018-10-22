const log = console.log;

function findById(programs: any, uniqueId: string) {
    for (let i = 0; i < programs.length; i++) {
        if (programs[i].uniqueId === uniqueId) {
            return {
                invocation: programs[i],
                path: []
            };
        }
        log("finding in", programs, i, uniqueId);
        return recurseFind(
            programs[i],
            uniqueId,
            []
        );
    }

}

function recurseFind(program: any, uniqueId: string, path: any): any {
    if (program.args === undefined)  {
        return false;
    }
    log("Checking", program.args.map((i: any) => i.uniqueId), uniqueId);
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

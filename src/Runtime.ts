import Arg from "./Arg";
import CORK from "./Cork";
import Invocation from "./Invocation";
import Socket from "./Socket";
import TowerError from "./TowerError";

export function evaluate(invocation: Invocation, inputs: any[], resultMap: object): any{
    // if there are any corks in inputs
    // then this isn't being evaluated just now.
    // it should be returned as a constant instead.
    // return a function with a new set of arguments.
    const evaluatedArgs = invocation.args.map((arg: any) => {
        if (arg instanceof Socket) {
            return arg;
        } else if (arg instanceof Arg) {
            return inputs[0];
        } else if (arg.isInvocation) {
            if (isInvocationGettingCorked(arg)) {
                return corkInvocation(arg);
            } else {
                return evaluate(arg, inputs, resultMap);
            }
        } else if (arg.isConstant) {
            return arg.value;
        }
    });
    for (const arg of evaluatedArgs) {
        if (arg instanceof Socket) {
            return new Socket();
        }
        if (arg instanceof TowerError) {
            return arg;
        }
    }
    console.log("Invocation", invocation, "evaluated to", evaluatedArgs);

    const returnValue = invokeImplementation(invocation, evaluatedArgs);
    resultMap[invocation.uniqueId] = returnValue;
    return returnValue;
}

function isInvocationGettingCorked(invocation: Invocation) {
    for (const arg of invocation.args) {
        if (arg === CORK) {
            return true;
        }
    }
    return false;
}

function corkInvocation(invocation: Invocation) {
    return (...args: any[]) => {
        let numCorksSeen = 0;
        const finalArgs = invocation.args.map((arg: any, i: number) => {
            if (arg === CORK) {
                const result = args[i - numCorksSeen];
                numCorksSeen += 1;
                return result;
            } else {
                return arg;
            }
        });
        return invocation.libraryFunction.implementation(...finalArgs);
    };
}

function invokeImplementation(invocation: Invocation, evaluatedArgs: any[]) {
    // try {
        return invocation.libraryFunction.implementation(...evaluatedArgs);
    // } catch (e) {
    //     return e as TowerError;
    // }
}

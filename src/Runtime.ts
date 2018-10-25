import Arg from "./Arg";
import Cork from "./Cork";
import Invocation from "./Invocation";
import LazyValue from "./LazyValue";
import Socket from "./Socket";
import TowerError from "./TowerError";

export function evaluate(invocation: Invocation, inputs: any[], resultMap: object): any{
    if (!invocation.isInvocation) {
        return "Empty tower.";
    }
    const lazyArgs = invocation.args.map((arg: any) => {
        if (arg instanceof Socket) {
            return arg;
        } else if (arg instanceof Arg) {
            return new LazyValue(() => inputs[0]);
        } else if (arg.isInvocation) {
            if (isInvocationGettingCorked(arg)) {
                return corkInvocation(arg);
            } else {
                const evaluated = evaluate(arg, inputs, resultMap);
                if (evaluated.isLazyValue || evaluated instanceof Socket) {
                    return evaluated;
                } else {
                    return new LazyValue(() => evaluated);
                }
            }
        } else if (arg.isConstant) {
            return new LazyValue(() => arg.value);
        }
    });
    for (const arg of lazyArgs) {
        if (arg instanceof Socket) {
            return new Socket();
        }
        if (arg instanceof TowerError) {
            return arg;
        }
    }

    const returnValue = invokeImplementation(invocation, lazyArgs);
    resultMap[invocation.uniqueId] = returnValue;
    return returnValue;
}

function isInvocationGettingCorked(invocation: Invocation) {
    for (const arg of invocation.args) {
        if (arg instanceof Cork) {
            return true;
        }
    }
    return false;
}

function corkInvocation(invocation: Invocation) {
    const corked = (...args: any[]) => {
        let numCorksSeen = 0;
        const finalArgs = invocation.args.map((arg: any, i: number) => {
            if (arg instanceof Cork) {
                const result = args[i - numCorksSeen];
                numCorksSeen += 1;
                return result;
            } else {
                return arg;
            }
        });
        return invocation.libraryFunction.implementation(...finalArgs);
    };
    return new LazyValue(() => corked);
}

function invokeImplementation(invocation: Invocation, lazyArgs: any[]) {
    // try {
        if (!invocation.libraryFunction.isLazy) {
            const evaluatedArgs = lazyArgs.map((arg) => arg.get());
            return invocation.libraryFunction.implementation(...evaluatedArgs);
        } else {
            return invocation.libraryFunction.implementation(...lazyArgs);
        }
    // } catch (e) {
    //     return e as TowerError;
    // }
}

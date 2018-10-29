import Arg from "./Arg";
import Cork from "./Cork";
import Invocation from "./Invocation";
import LazyValue from "./LazyValue";
import Socket from "./Socket";
import TowerError from "./TowerError";

export function evaluate(invocation: Invocation, inputs: any[], library: object, modules: object, resultMap: object): any{
    if (!invocation.isInvocation) {
        return "Empty tower.";
    }
    const lazyArgs = makeLazyArgs(invocation.args, inputs, library, modules, resultMap);
    for (const arg of lazyArgs) {
        if (arg instanceof TowerError) {
            return arg;
        }
        if (Socket.describes(arg)) {
            return arg;
        }
    }

    const returnValue = invocation.invoke(lazyArgs, library, modules);
    resultMap[invocation.uniqueId] = returnValue;
    return returnValue;
}

function makeLazyArgs(args: any, inputs: any[], library: any, modules: object, resultMap: object) {
    return args.map((arg: any) => {
        if (Socket.describes(arg)) {
            return arg;
        } else if (arg instanceof Arg) {
            return LazyValue.wrap(inputs[0]);
        } else if (arg.isInvocation) {
            if (isInvocationGettingCorked(arg)) {
                return corkInvocation(arg, library, modules);
            } else {
                return new LazyValue(() => {
                    return evaluate(arg, inputs, library, modules, resultMap);
                });
            }
        } else if (arg.isConstant) {
            return LazyValue.wrap(arg.value);
        }
    });
}

function isInvocationGettingCorked(invocation: Invocation) {
    for (const arg of invocation.args) {
        if (arg instanceof Cork) {
            return true;
        }
    }
    return false;
}

function corkInvocation(invocation: Invocation, library: object, modules: object) {
    const corked = (...args: any[]) => {
        let numCorksSeen = 0;
        const finalArgs = invocation.args.map((arg: any, i: number) => {
            if (arg instanceof Cork) {
                const result = args[i - numCorksSeen];
                numCorksSeen += 1;
                return LazyValue.wrap(result);
            } else {
                return LazyValue.wrap(arg);
            }
        });
        return invocation.invoke(finalArgs, library, modules);
    };
    return LazyValue.wrap(corked);
}

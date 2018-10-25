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
        if (arg instanceof Socket) {
            return new Socket();
        }
        if (arg instanceof TowerError) {
            return arg;
        }
    }

    const returnValue = invokeImplementation(invocation, lazyArgs, library, modules);
    resultMap[invocation.uniqueId] = returnValue;
    return returnValue;
}

function makeLazyArgs(args: any, inputs: any[], library: any, modules: object, resultMap: object) {
    return args.map((arg: any) => {
        if (arg instanceof Socket) {
            return arg;
        } else if (arg instanceof Arg) {
            return LazyValue.wrap(inputs[0]);
        } else if (arg.isInvocation) {
            if (isInvocationGettingCorked(arg)) {
                return corkInvocation(arg, library, modules);
            } else {
                const evaluated = evaluate(arg, inputs, library, modules, resultMap);
                if (evaluated.isLazyValue || evaluated instanceof Socket) {
                    return evaluated;
                } else {
                    return LazyValue.wrap(evaluated);
                }
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

function invokeImplementation(invocation: Invocation, lazyArgs: any[], library: any, modules: object) {
    // try {
        // if (invocation.libraryFunction(library, modules).isEager) {
        //     const evaluatedArgs = lazyArgs.map((arg) => arg.get());
        //     return invocation.invoke(evaluatedArgs, library, modules);
        // } else {
        return invocation.invoke(lazyArgs, library, modules);
    // }
    // } catch (e) {
    //     return e as TowerError;
    // }
}

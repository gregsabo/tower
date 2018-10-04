import Arg from "./Arg";
import Invocation from "./Invocation";

export function evaluate(invocation: Invocation, inputs: any[]): any{
    console.log("Invocation", invocation, "with inputs", inputs);
    const evaluatedArgs = invocation.args.map((arg: any) => {
        if (arg instanceof Arg) {
            return inputs[0];
        } else if (arg.isInvocation) {
            return evaluate(arg, inputs);
        } else if (arg.isConstant) {
            return arg.value;
        }
    });
    console.log("Evaluated args to", evaluatedArgs);
    console.log("For invocation", invocation);

    return invocation.libraryFunction.implementation(...evaluatedArgs);
}

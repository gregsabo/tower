import { ILibrary, IModules } from "./Types";
import { Invocation } from "./Invocation";

export default function mapInvocations(invocation: Invocation, func: any, library: ILibrary, modules: IModules) {
    func(invocation);
    const inputs = invocation.getOrderedInputs(library, modules);
    inputs.forEach(input => {
        if (input instanceof Invocation) {
            mapInvocations(input, func, library, modules);
        }
    });

}
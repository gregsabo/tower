import { ILibrary, IModules } from "./Types";
import { Invocation } from "./Invocation";

// export default function mapInvocationsInTower(tower: ITower, func: any, library: ILibrary, modules: IModules) {
//     if (tower.rootBrick instanceof Invocation) {
//         mapInvocations(tower.rootBrick, func, library, modules);
//     }
// }

export default function mapInvocations(invocation: Invocation, func: any, library: ILibrary, modules: IModules) {
    func(invocation);
    const inputs = invocation.getOrderedInputs(library, modules);
    inputs.forEach(input => {
        if (input instanceof Invocation) {
            mapInvocations(input, func, library, modules);
        }
    });

}
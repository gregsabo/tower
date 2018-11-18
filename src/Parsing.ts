// Tower mostly doesn't need parsing.
// This just parses string and number literals.

// import Constant from "./Constant";

import {TowerPrimitive} from "./Types";

export function parseLiteral(givenString: string) : TowerPrimitive {
    if (givenString.trim()[0] === "[" && givenString.indexOf("]") > -1) {
        const withoutBraces = givenString
            .trim()
            .replace("[", "")
            .replace("]", "");
        return withoutBraces.split(",").filter(parseable).map(parseLiteral) as TowerPrimitive;
    }
    const givenNum = Number.parseFloat(givenString);
    if (Number.isNaN(givenNum)) {
        return givenString as TowerPrimitive;
    } else {
        return givenNum as TowerPrimitive;
    }
}

export function parseable(givenString: string) {
    return givenString.trim() !== "";
}
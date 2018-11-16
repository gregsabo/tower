// Tower mostly doesn't need parsing.
// This just parses string and number literals.

import Constant from "./Constant";

export function parseLiteral(givenString: string) {
    if (givenString === null) {
        return Constant.create({value: 0});
    }
    const givenNum = Number.parseFloat(givenString);
    if (Number.isNaN(givenNum)) {
        return givenString;
    } else {
        return givenNum;
    }
}
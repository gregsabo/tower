// Tower mostly doesn't need parsing.
// This just parses string and number literals.

// import Constant from "./Constant";

export function parseLiteral(givenString: string) {
    if (givenString === null) {
        return null;
    }
    if (givenString.trim() === "") {
        return null;
    }
    if (givenString.trim()[0] === "[" && givenString.indexOf("]") > -1) {
        const withoutBraces = givenString
            .trim()
            .replace("[", "")
            .replace("]", "");
        return withoutBraces.split(",").map(parseLiteral);
    }
    const givenNum = Number.parseFloat(givenString);
    if (Number.isNaN(givenNum)) {
        return givenString;
    } else {
        return givenNum;
    }
}
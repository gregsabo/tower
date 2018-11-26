import { evaluate } from "./Runtime";
import { Invocation } from "./Invocation";
import Library from "./Library";
import { Arg } from "./Arg";
import { Constant } from "./Constant";

it("adds two", () => {
  const invocation = new Invocation({
    args: [new Arg(), new Constant({ value: 2 })],
    implementationKey: "add"
  });
  const modules = {
    basic: {
      towers: {
        addsTwo: {
          brickKey: "addsTwo",
          moduleKey: "basic",
          name: "Adds two",
          numArgs: 1,
          rootBrick: invocation,
          tests: []
        }
      }
    }
  };
  const result = evaluate(invocation, [3], Library, modules, {});

  expect(result).toEqual(5);
});

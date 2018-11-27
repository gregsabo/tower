import { evaluate } from "./Runtime";
import { Invocation } from "./Invocation";
import Library from "./Library";
import { Input } from "./Input";
import { Constant } from "./Constant";

it("adds two", () => {
  const invocation = new Invocation({
    inputs: { a: new Input(), b: new Constant({ value: 2 }) },
    implementationKey: "add"
  });
  const modules = {
    basic: {
      towers: {
        addsTwo: {
          brickKey: "addsTwo",
          moduleKey: "basic",
          name: "Adds two",
          inputs: [
            { key: "a", displayName: "a" },
            { key: "b", displayName: "b" }
          ],
          rootBrick: invocation,
          tests: []
        }
      }
    }
  };
  const result = evaluate(invocation, [3], Library, modules, {});

  expect(result).toEqual(5);
});

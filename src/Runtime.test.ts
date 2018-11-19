import { evaluate } from "./Runtime";
import Invocation from "./Invocation";
import Library from "./Library";
import Arg from "./Arg";
import Constant from "./Constant";

it("adds two", () => {
  const invocation = Invocation.create({
    args: [Arg.create(), Constant.create({ value: 2 })],
    implementationKey: "add"
  });
  const modules = {
    basic: {
      bricks: {
        addsTwo: {
          brickKey: "addsTwo",
          moduleKey: "basic",
          name: "Adds two",
          numArgs: 1,
          rootInvocation: invocation,
          tests: []
        }
      }
    }
  };
  const result = evaluate(invocation, [3], Library, modules, {});

  expect(result).toEqual(5);
});

import { evaluate } from "./Runtime";
import { Invocation } from "./Invocation";
import Library from "./Library";
import { Input } from "./Input";
import { Constant } from "./Constant";
import { makeUniqueId } from "./MakeUniqueId";
import { Cork } from "./Cork";

it("adds two", () => {
  const inputKey = makeUniqueId();
  const invocation = new Invocation({
    inputs: {
      a: new Input({ inputKey }),
      b: new Constant({ value: 2 })
    },
    implementationKey: "add"
  });
  const modules = {
    basic: {
      towers: {
        addsTwo: {
          towerKey: "addsTwo",
          moduleKey: "basic",
          name: "Adds two",
          inputs: [{ key: inputKey, displayName: "a" }],
          rootBrick: invocation,
          tests: []
        }
      }
    }
  };
  const result = evaluate(invocation, [3], Library, modules, {});

  expect(result).toEqual(5);
});

it("maps corked bricks", () => {
  const invocation = new Invocation({
    inputs: {
      a: new Constant({ value: [1, 2, 3] }),
      func: new Invocation({
        inputs: {
          a: new Constant({ value: 2 }),
          b: new Cork()
        },
        implementationKey: "add"
      })
    },
    implementationKey: "map"
  });
  const modules = {
    basic: {
      towers: {
        addsTwo: {
          towerKey: "addsTwo",
          moduleKey: "basic",
          name: "Doubles everything",
          inputs: [],
          rootBrick: invocation,
          tests: []
        }
      }
    }
  };
  const result = evaluate(invocation, [], Library, modules, {});

  expect(result).toEqual([3, 4, 5]);
});

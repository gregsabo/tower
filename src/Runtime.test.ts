import { evaluate } from "./Runtime";
import { Invocation } from "./Invocation";
import Library from "./Library";
import { Input } from "./Input";
import { Constant } from "./Constant";
import { makeUniqueId } from "./MakeUniqueId";
import { Cork } from "./Cork";

it("adds two", async () => {
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
  const result = await evaluate(
    invocation,
    [3],
    { [inputKey]: 0 },
    Library,
    modules,
    {}
  );

  expect(result).toEqual(5);
});

it("maps corked bricks", async () => {
  const invocation = new Invocation({
    inputs: {
      a: new Constant({ value: [100, 200, 300] }),
      func: new Invocation({
        inputs: {
          b: new Constant({ value: 5 }),
          a: new Cork()
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
          name: "Adds 5 to 100, 200, and 300.",
          inputs: [],
          rootBrick: invocation,
          tests: []
        }
      }
    }
  };
  const result = await evaluate(invocation, [], {}, Library, modules, {});
  console.log(result)

  expect(result).toEqual([105, 205, 305]);
});

it("mocks IO bricks", async () => {
  const invocation = new Invocation({
    inputs: {},
    implementationKey: "time"
  });
  const modules = {
    basic: {
      towers: {
        addsTwo: {
          towerKey: "currentTime",
          moduleKey: "basic",
          name: "Returns current timestamp",
          inputs: [],
          rootBrick: invocation,
          tests: []
        }
      }
    }
  };

  const mocks = {};
  mocks[invocation.uniqueId] = {
    inputs: {},
    output: 333
  };
  const result = await evaluate(invocation, [], {}, Library, modules, {}, mocks);
  console.log(result)
  expect(result).toEqual(333);

});

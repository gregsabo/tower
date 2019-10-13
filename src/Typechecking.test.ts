import {checkTypes} from "./Typechecking";
import Library from "./Library";
import { Constant } from "./Constant";
import { Invocation } from "./Invocation";
import { t } from "./ITowerType";

it("returns an empty object when there are no type errors", () => {
  const invocation = new Invocation({
    inputs: {
      a: new Constant({ value: 3 }),
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
          inputs: [],
          rootBrick: invocation,
          tests: []
        }
      }
    }
  };
  const result = checkTypes(invocation, Library, modules);

  expect(result).toEqual({});
});

it("returns a type error", () => {
  const stringConstant = new Constant({value: "foobar"});
  const invocation = new Invocation({
    inputs: {
      a: stringConstant,
      b: new Constant({ value: 2 })
    },
    implementationKey: "add"
  });
  console.log("Unique id", invocation.uniqueId);
  const modules = {
    basic: {
      towers: {
        addsTwo: {
          towerKey: "addsTwo",
          moduleKey: "basic",
          name: "Adds two",
          inputs: [],
          rootBrick: invocation,
          tests: []
        }
      }
    }
  };
  const result = checkTypes(invocation, Library, modules);
  const expected = {}
  expected[stringConstant.uniqueId] = {
    expected: t("number"),
    was: t("string")
  };

  expect(result).toEqual(expected);
});

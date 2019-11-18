import autobind from "autobind-decorator";
import * as React from "react";
import * as Runtime from "./Runtime";
import Value from "./Value";
import { parseLiteral } from "./Parsing";
import "./TestGrid.css";
import {
  ITest,
  ILibrary,
  IModules,
  ITower,
  IInputConfiguration,
  TowerPrimitive
} from "./Types";
import { isEqual } from "lodash";

interface IProps {
  brick: ITower;
  onTestsChanged: any;
  library: ILibrary;
  modules: IModules;
}

export default class TestGrid extends React.Component<IProps> {
  private firstCell?: HTMLInputElement;

  public componentDidMount() {
    if (this.props.brick.tests.length === 0) {
      for (let i = 0; i < 10; i++) {
        this.props.brick.tests.push(this.newTest());
      }
      this.props.onTestsChanged(this.props.brick.tests);
    }
    if (this.firstCell) {
      this.firstCell.focus();
      this.firstCell.select();
    }
  }

  public render() {
    return (
      <table className="TestGrid">
        <thead>
          <tr>
            <td />
            {this.props.brick.inputs.map(this.renderInputHeader)}
            <td>Expected Result</td>
            <td>Actual Result</td>
          </tr>
        </thead>
        <tbody>{this.props.brick.tests.map(this.renderTest)}</tbody>
      </table>
    );
  }

  @autobind
  public renderInputHeader(inputConfig: IInputConfiguration, i: number) {
    return <td key={i}>{inputConfig.displayName}</td>;
  }

  @autobind
  public renderTest(test: ITest, num: number) {
    test = test || this.newTest();
    const result = this.renderResult(test);
    const passed = this.testPassed(test, result);
    return (
      <tr
        className={
          passed ? "TestGrid-passingTestCase" : "TestGrid-failingTestCase"
        }
        key={num}
      >
        <td className="TestGrid-digitColumn">{(num + 1) % 10}</td>
        {this.props.brick.inputs.map(
          (inputConfig: IInputConfiguration, i: number) => {
            return this.renderInputValue(inputConfig, test, i);
          }
        )}
        <td>
          <input
            className="TestGrid-input"
            type="text"
            contentEditable={true}
            onChange={this.onExpectationChanged.bind(this, num)}
            value={test.expected}
          />
        </td>
        <td><Value value={result} /></td>
      </tr>
    );
  }

  public renderInputValue(
    inputConfig: IInputConfiguration,
    test: ITest,
    i: number
  ) {
    return (
      <td key={i}>
        <input
          className="TestGrid-input"
          type="text"
          contentEditable={true}
          onChange={this.onArgChanged.bind(this, test, inputConfig.key)}
          value={test.inputs[inputConfig.key]}
        />
      </td>
    );
  }

  public renderResult(test: ITest) {
    let result = null;

    let parsedExpected;
    if (test.expected !== null) {
      parsedExpected = parseLiteral(test.expected);
    }

    if (!this.props.brick.rootBrick) {
      return "Empty tower.";
    } else {
      try {
        result = Runtime.evaluate(
          this.props.brick.rootBrick,
          this.makeOrderedValues(test),
          this.makeInputNumMap(),
          this.props.library,
          this.props.modules,
          {}
        );
      } catch (e) {
        result = "ERROR: " + e.message;
      }

      if (isEqual(result, parsedExpected)) {
        return "=";
      } else {
        return result;
      }
    }
  }

  public makeOrderedValues(test: ITest): TowerPrimitive[] {
    return this.props.brick.inputs.map((inputConfig: IInputConfiguration) => {
      return parseLiteral(test.inputs[inputConfig.key] || "");
    });
  }

  public makeInputNumMap(): { [key: string]: number } {
    const map = {};
    this.props.brick.inputs.map(
      (inputConfig: IInputConfiguration, i: number) => {
        map[inputConfig.key] = i;
      }
    );
    return map;
  }

  public testPassed(test: ITest, result: string) {
    if (test.expected === null) {
      return true;
    }
    const parsedExpected = parseLiteral(test.expected || "");
    if (result === "=") {
      return true;
    }

    if (
      Object.keys(test.inputs).length === 0 ||
      test.inputs[0] === "" ||
      parsedExpected === ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  @autobind
  public onArgChanged(
    testCase: ITest,
    inputKey: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    testCase.inputs[inputKey] = e.target.value;
    console.log("Setting", inputKey, "of", testCase, "to", e.target.value);
    this.props.onTestsChanged(this.props.brick.tests);
  }

  @autobind
  public onExpectationChanged(
    row: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const test = this.getTestNum(row);
    test.expected = e.target.value;
    this.props.onTestsChanged(this.props.brick.tests);
  }

  public getTestNum(num: number) {
    if (this.props.brick.tests === undefined) {
      this.props.brick.tests = [];
    }
    if (!this.props.brick.tests[num]) {
      this.props.brick.tests[num] = this.newTest();
    }
    return this.props.brick.tests[num];
  }

  public newTest() {
    return {
      inputs: {},
      expected: ""
    };
  }

  public renderEmptyTests() {
    const tests = [];
    for (let i = this.props.brick.tests.length; i < 10; i++) {
      tests.push(
        this.renderTest(
          {
            inputs: {},
            expected: ""
          },
          i
        )
      );
    }
    return tests;
  }
}

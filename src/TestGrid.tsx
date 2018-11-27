import autobind from "autobind-decorator";
import * as React from "react";
import * as Runtime from "./Runtime";
import Value from "./Value";
import { parseLiteral } from "./Parsing";
import "./TestGrid.css";
import { ITest, ILibrary, IModules } from "./Types";

interface IProps {
  brick: any;
  onTestsChanged: any;
  library: ILibrary;
  modules: IModules;
}

export default class TestGrid extends React.Component<IProps> {
  private firstCell?: HTMLInputElement;

  public componentDidMount() {
    console.log("Testgrid mounted", this.firstCell);
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
            <td>ARG 1</td>
            <td>Expected Result</td>
            <td>Actual Result</td>
          </tr>
        </thead>
        <tbody>{this.props.brick.tests.map(this.renderTest)}</tbody>
      </table>
    );
  }

  @autobind
  public renderTest(test: ITest, num: number) {
    test = test || this.newTest();
    let ref;
    if (num === 0) {
      ref = (first: HTMLInputElement) => (this.firstCell = first);
    }
    const result = this.renderResult(test);
    const passed = this.testPassed(test, result);
    return (
      <tr
        className={
          passed ? "TestGrid-passingTestCase" : "TestGrid-failingTestCase"
        }
      >
        <td className="TestGrid-digitColumn">{(num + 1) % 10}</td>
        <td>
          <input
            className="TestGrid-input"
            type="text"
            ref={ref}
            contentEditable={true}
            onChange={this.onArgChanged.bind(this, num, 0)}
            value={test.inputs[0]}
          />
        </td>
        <td>
          <input
            className="TestGrid-input"
            type="text"
            contentEditable={true}
            onChange={this.onExpectationChanged.bind(this, num)}
            value={test.expected}
          />
        </td>
        <td>{result ? <Value value={result} /> : null}</td>
      </tr>
    );
  }

  public renderResult(test: ITest) {
    const inputs = test.inputs;
    let result = null;

    let parsedExpected;
    if (test.expected !== null) {
      parsedExpected = parseLiteral(test.expected);
    }

    if (test.inputs.length === 0 || test.inputs[0] === "") {
      return "";
    } else if (inputs.length === this.props.brick.numInputs) {
      try {
        result = Runtime.evaluate(
          this.props.brick.rootBrick,
          test.inputs.map(parseLiteral),
          this.props.library,
          this.props.modules,
          {}
        );
      } catch (e) {
        result = "ERROR: " + e.message;
      }

      if (result === parsedExpected) {
        return "=";
      } else {
        return result;
      }
    }
  }

  public testPassed(test: ITest, result: string) {
    if (test.expected === null) {
      return true;
    }
    const parsedExpected = parseLiteral(test.expected);
    if (result === "=") {
      return true;
    }

    if (
      test.inputs.length === 0 ||
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
    row: number,
    argnum: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const test = this.getTestNum(row);
    test.inputs[argnum] = e.target.value;
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
      args: [],
      expected: ""
    };
  }

  public renderEmptyTests() {
    const tests = [];
    for (let i = this.props.brick.tests.length; i < 10; i++) {
      tests.push(
        this.renderTest(
          {
            inputs: [],
            expected: ""
          },
          i
        )
      );
    }
    return tests;
  }
}

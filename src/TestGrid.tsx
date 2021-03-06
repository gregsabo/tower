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
  UniqueId
} from "./Types";
import { isEqual } from "lodash";
import mocksForTower, { IMockSignature } from "./mocksForTower";
import { forEach } from "lodash";
import { makeOrderedValues, makeInputNumMap } from "./TestHelpers";

interface IProps {
  brick: ITower;
  onTestsChanged: any;
  library: ILibrary;
  modules: IModules;
  onTestSelected: any;
}

type ITestRun = Promise<any> | any;

interface IState {
  testRuns: ITestRun[];
}

export default class TestGrid extends React.Component<IProps, IState> {
  private firstCell?: HTMLInputElement;

  constructor(props: IProps) {
    super(props);
    this.state = { testRuns: [] };
    this.instantiateTestCases();
    forEach(this.props.brick.tests, (_: ITest, num: number) => {
      this.runTest(num);
    })
  }

  public componentDidMount() {
    // TODO: Actually set this
    if (this.firstCell) {
      this.firstCell.focus();
      this.firstCell.select();
    }
  }

  public render() {
    const mocks = mocksForTower(
      this.props.brick,
      this.props.library,
      this.props.modules
    );
    return (
      <table className="TestGrid">
        <thead>
          <tr>
            <td />
            {this.props.brick.inputs.map(this.renderInputHeader)}
            {mocks.map(this.renderMockOutputHeader)}
            <td>Expected Result</td>
            <td>Actual Result</td>
          </tr>
        </thead>
        <tbody>
          {this.props.brick.tests.map((test, num) => {
            return this.renderTest(test, mocks, num);
          })}
        </tbody>
      </table>
    );
  }

  private instantiateTestCases() {
    if (this.props.brick.tests.length === 0) {
      for (let i = 0; i < 10; i++) {
        this.props.brick.tests.push(this.newTest());
      }
      this.props.onTestsChanged(this.props.brick.tests);
    }
  }


  @autobind
  private renderInputHeader(inputConfig: IInputConfiguration, i: number) {
    return <td key={i}>{inputConfig.displayName}</td>;
  }

  @autobind
  private renderMockOutputHeader(mockSignature: IMockSignature, i: number) {
    return (
      <td key={"mockoutput" + mockSignature.uniqueId}>
        {mockSignature.displayName} (simulated output)
      </td>
    );
  }

  @autobind
  private renderTest(test: ITest, mocks: IMockSignature[], num: number) {
    test = test || this.newTest();
    const result = this.renderResult(test, num);
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
            return this.renderInputValue(inputConfig, test, i, num);
          }
        )}
        {mocks.map((mockSignature: IMockSignature) => {
          const mock = test.mocks[mockSignature.uniqueId] || {};
          return this.renderMockOutput(
            mock.output,
            mockSignature.uniqueId,
            num
          );
        })}
        <td>
          <input
            className="TestGrid-input"
            type="text"
            contentEditable={true}
            onChange={this.onExpectationChanged.bind(this, num)}
            onFocus={this.props.onTestSelected.bind(this, num)}
            value={test.expected}
          />
        </td>
        <td>
          <Value value={result} />
        </td>
      </tr>
    );
  }

  private renderMockOutput(output: any, uniqueId: UniqueId, num: number) {
    return (
      <td>
        <input
          className="TestGrid-input"
          type="text"
          contentEditable={true}
          onChange={this.onMockOutputChanged.bind(this, num, uniqueId)}
          onFocus={this.props.onTestSelected.bind(this, num)}
          value={output}
        />
      </td>
    );
  }

  @autobind
  private onMockOutputChanged(
    testNum: number,
    mockedInvocationId: UniqueId,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    console.log("Changing mock output for", testNum);
    const mocks = this.props.brick.tests[testNum].mocks;
    if (!mocks[mockedInvocationId]) {
      mocks[mockedInvocationId] = this.newMock();
    }
    mocks[mockedInvocationId].output = parseLiteral(e.target.value);
    this.props.onTestsChanged(this.props.brick.tests);
    this.runTest(testNum);
    this.setState({});
  }

  private renderInputValue(
    inputConfig: IInputConfiguration,
    test: ITest,
    inputNum: number,
    testNum: number
  ) {
    return (
      <td key={inputNum}>
        <input
          className="TestGrid-input"
          type="text"
          contentEditable={true}
          onChange={this.onArgChanged.bind(this, test, inputNum, inputConfig.key)}
          onFocus={this.props.onTestSelected.bind(this, testNum)}
          value={test.inputs[inputConfig.key]}
        />
      </td>
    );
  }

  private renderResult(test: ITest, num: number) {
    let result = null;

    let parsedExpected;
    if (test.expected !== null) {
      parsedExpected = parseLiteral(test.expected);
    }

    if (num in this.state.testRuns) {
      result = this.state.testRuns[num];
      if (result.then) {
        return "Calculating...";
      }
      if (isEqual(result, parsedExpected)) {
        return "=";
      } else {
        return result;
      }
    } else {
      return "Test was not run";
    }
  }

  private runTest(num: number) : void {
    if (!this.props.brick.rootBrick) {
      return;
    }
    try {
      const test = this.props.brick.tests[num];
      let result = null;
      result = Runtime.evaluate(
        this.props.brick.rootBrick,
        makeOrderedValues(this.props.brick, test),
        makeInputNumMap(this.props.brick),
        this.props.library,
        this.props.modules,
        {},
        test.mocks
      );
      this.state.testRuns[num] = result;
      result.then(value => {
        this.state.testRuns[num] = value;
        this.setState({ testRuns: this.state.testRuns });
      });
    } catch (e) {
      this.state.testRuns[num] = "Error: " + e.message;
    }
  }

  private testPassed(test: ITest, result: string) {
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
  private onArgChanged(
    testCase: ITest,
    testNum: number,
    inputKey: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    testCase.inputs[inputKey] = e.target.value;
    this.props.onTestsChanged(this.props.brick.tests);
    this.runTest(testNum);
    this.setState({});
  }

  @autobind
  private onExpectationChanged(
    row: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const test = this.getTestNum(row);
    test.expected = e.target.value;
    this.props.onTestsChanged(this.props.brick.tests);
  }

  private getTestNum(num: number) {
    if (this.props.brick.tests === undefined) {
      this.props.brick.tests = [];
    }
    if (!this.props.brick.tests[num]) {
      this.props.brick.tests[num] = this.newTest();
    }
    return this.props.brick.tests[num];
  }

  private newMock() {
    return {
      inputs: {},
      output: null
    };
  }

  private newTest() {
    return {
      inputs: {},
      mocks: {},
      expected: ""
    };
  }
}

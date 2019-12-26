import { ILibrary, IModules, ITower } from "./Types";
import * as React from "react";
import { makeOrderedValues, makeInputNumMap } from "./TestHelpers";
import * as Runtime from "./Runtime";

interface IProps {
  brick: ITower;
  library: ILibrary;
  modules: IModules;
  testNum: number;
}

interface IState {
  result: any;
}

export default class ExecuteComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { result: null };
  }

  public componentDidMount() {
    if (!this.props.brick.rootBrick) {
      return;
    }
    const test = this.props.brick.tests[this.props.testNum];
    const result = Runtime.evaluate(
      this.props.brick.rootBrick,
      makeOrderedValues(this.props.brick, test),
      makeInputNumMap(this.props.brick),
      this.props.library,
      this.props.modules,
      {},
      test.mocks
    );
    this.setState({
      result
    });
    result.then(value => {
      console.log("Setting state to value", value);
      this.setState({ result: value });
    });
  }

  public render() {
    if (this.state.result === null || this.state.result.then) {
      return <div>Loading...</div>;
    }
    return <div>{this.state.result}</div>;
  }
}

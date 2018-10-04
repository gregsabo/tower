import autobind from "autobind-decorator";
import * as React from "react";
import * as Runtime from "./Runtime";

interface IProps {
    program: any;
}

interface IState {
    inputValue: any;
    lastInput: any;
}

export default class Executor extends React.Component<IProps, IState> {
    public contents: any;
    public state: IState = {
        inputValue: 0,
        lastInput: 0
    };

    public render() {
        return <div>
            Execute:
            <input type="text" placeholder="Input" onChange={this.setValue}/>
            <button onClick={this.execute}>Run</button>
            Result:
            <div>{Runtime.evaluate(this.props.program[0], [this.state.lastInput || ""])}</div>
        </div>;
    }

    @autobind
    public setValue(e: any) {
        this.setState({inputValue: e.target.value});
        this.execute(e);
    }

    @autobind
    public execute(e: any) {
        this.setState({lastInput: this.state.inputValue});
    }
}

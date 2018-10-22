import autobind from "autobind-decorator";
import * as React from "react";
import "./Executor.css";
import * as Runtime from "./Runtime";
import Socket from "./Socket";

interface IProps {
    program: any;
}

interface IState {
    inputValue: any;
    lastInput: any;
}

function renderResult(result: any) {
    if (result instanceof Socket) {
        return "<unfilled socket>";
    } else if (result instanceof Error) {
        return `Error: ${result.message}`;
    } else {
        return result;
    }
}

export default class Executor extends React.Component<IProps, IState> {
    public contents: any;
    public state: IState = {
        inputValue: 0,
        lastInput: 0
    };

    public render() {
        const result = Runtime.evaluate(this.props.program[0], [this.state.lastInput || ""], {});
        return <div className="Executor">
            Execute:
            <input type="text" placeholder="Input" onInput={this.setValue}/>
            Result:
            <span>{renderResult(result)}</span>
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

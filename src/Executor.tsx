import autobind from "autobind-decorator";
import * as React from "react";
import "./Executor.css";
import * as Runtime from "./Runtime";
import Socket from "./Socket";
import TowerError from "./TowerError";
import {ILibrary} from "./Types";

interface IProps {
    program: any;
    library: ILibrary;
    modules: any;
}

interface IState {
    lastInput: any;
}

function renderResult(result: any) {
    if (Socket.describes(result)) {
        return "<unfilled socket>";
    } else if (result instanceof Error) {
        return `Error: ${result.message}`;
    } else if (Array.isArray(result)) {
        return <table>
            <tr>
                {result.map((item, i) => <td key={i}>{item}</td>)}
            </tr>
        </table>
    } else {
        return result;
    }
}

export default class Executor extends React.Component<IProps, IState> {
    public contents: any;
    public state: IState = {
        lastInput: 0
    };

    public render() {
        const result = this.evaulateAndCatch();
        return <div className="Executor">
            Execute:
            <input type="text" placeholder="Input" onChange={this.setValue}/>
            Result:
            <span>{renderResult(result)}</span>
        </div>;
    }

    public evaulateAndCatch() {
        try {
            return Runtime.evaluate(
                this.props.program.rootInvocation,
                [this.state.lastInput || ""],
                this.props.library,
                this.props.modules,
                {}
            );
        } catch (e) {
            return e as TowerError;
        }
    }

    @autobind
    public setValue(e: any) {
        const stringInput = e.target.value;
        let finalInput;
        if (isNaN(parseFloat(stringInput))) {
            finalInput = stringInput;
        } else {
            finalInput = parseFloat(stringInput);
        }
        this.setState({lastInput: finalInput});
    }
}

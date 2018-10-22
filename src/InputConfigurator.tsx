import autobind from "autobind-decorator";
import * as React from "react";
import InputConfiguration from "./InputConfiguration";
import "./InputConfigurator.css";

interface IProps {
    inputs: InputConfiguration[];
    onInputsChanged: any;
}

class InputConfigurator extends React.Component<IProps, {}> {
    public inputBox: any;

    public render() {
        return <div className="InputConfigurator">
            Inputs:
            {this.props.inputs.map(this.renderDropdownForConfiguration)}
            {this.maybeRenderAdder()}
        </div>;
    }

    @autobind
    private renderDropdownForConfiguration(config: InputConfiguration, index: number) {
        return <select value={config.numSubinputs} className="InputConfiguration-selector" onChange={this.makeSelectorForIndex(index)}>
            <option value={0}>Input{index + 1} (Constant)</option>
            <option value={1}>Input{index + 1} (1 Sub-input)</option>
            <option value={2}>Input{index + 1} (2 Sub-inputs)</option>
            <option value={3}>Input{index + 1} (3 Sub-inputs)</option>
            (index > 0 ? <option value="delete">Remove this input</option>: null)
        </select>;
    }

    private makeSelectorForIndex(index: number) {
        return (event: any) => {
            const value = event.target.value;
            let newInputs;
            if (value === "delete") {
                newInputs = this.props.inputs.filter((input, i) => {
                    return i !== index;
                });
            } else {
                const numSubInputs = parseInt(value, 10);
                newInputs = this.props.inputs.map((input, i) => {
                    if (i === index) {
                        return new InputConfiguration(numSubInputs);
                    } else {
                        return input;
                    }
                });
            }
            return this.props.onInputsChanged(newInputs);
        };
    }

    private maybeRenderAdder() {
        if (this.props.inputs.length >= 5) {
            return null;
        }
        return <button onClick={this.addInput}>+ Add Input</button>;
    }

    @autobind
    private addInput() {
        if (this.props.inputs.length >= 5) {
            return null;
        }
        return this.props.onInputsChanged(
            this.props.inputs.concat([new InputConfiguration(0)])
            );
    }

    // private isIncreaseable() {
    //     return this.props.inputs.length < 5;
    // }

    // private isDecreaseable() {
    //     return this.props.inputs.length > 1;
    // }

}

export default InputConfigurator;

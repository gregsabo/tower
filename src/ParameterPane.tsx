import autobind from "autobind-decorator";
import * as React from "react";
import "./ParameterPane.css";
import { IInputConfiguration, IParameterEditingState } from "./Types";
import SingleParameterEditor from "./SingleParameterEditor";

interface IProps {
  parameters: IInputConfiguration[];
  parameterEditingState: IParameterEditingState;
  onNameChange: (num: number, newName: string) => void;
}

export default class ParameterPane extends React.Component<IProps> {
  public render() {
    return (
      <div className="ParameterPane">
        <h3>Parameters</h3>
        {this.props.parameters.map(this.renderParameter)}
      </div>
    );
  }

  @autobind
  public renderParameter(parameter: IInputConfiguration, num: number) {
    return (
      <SingleParameterEditor
        parameter={parameter}
        number={num}
        onNameChange={this.props.onNameChange.bind(null, num)}
        parameterEditingState={this.props.parameterEditingState}
        key={num}
      />
    );
  }
}

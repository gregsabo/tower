import * as React from "react";
import "./SingleParameterEditor.css";
import { IParameterEditingState, IInputConfiguration } from "./Types";
import autobind from "autobind-decorator";
import classnames from "classnames";

interface IProps {
  parameterEditingState: IParameterEditingState;
  parameter: IInputConfiguration;
  onNameChange: (value: string) => void;
  number: number;
}

function parameterIsNaming(props: IProps) {
  return (
    props.parameterEditingState &&
    props.parameterEditingState.mode === "naming" &&
    props.parameterEditingState.key === props.parameter.key
  );
}

function parameterIsSelected(props: IProps) {
  return (
    props.parameterEditingState &&
    props.parameterEditingState.mode === "cursor" &&
    props.parameterEditingState.key === props.parameter.key
  );
}

export default class SingleParameterEditor extends React.Component<IProps> {
  private input: HTMLInputElement | null = null;

  public render() {
    const num = this.props.number;
    const parameter = this.props.parameter;
    return (
      <div
        key={num}
        className={classnames("SingleParameterEditor", {
          "SingleParameterEditor--isNaming": parameterIsNaming(this.props),
          "SingleParameterEditor--isSelected": parameterIsSelected(this.props)
        })}
      >
        {num + 1}.{" "}
        <input
          value={parameter.displayName}
          ref={input => (this.input = input)}
          onChange={this.handleChange}
          className="SingleParameterEditor-input"
        />
      </div>
    );
  }

  public isNaming() {
    return (
      this.props.parameterEditingState &&
      this.props.parameterEditingState.mode === "naming" &&
      this.props.parameterEditingState.key === this.props.parameter.key
    );
  }

  public componentDidUpdate(oldProps: IProps) {
    if (!this.input) {
      return;
    }
    if (parameterIsNaming(this.props)) {
      this.input.focus();
    }
    if (!parameterIsNaming(this.props)) {
      this.input.blur();
    }
  }

  @autobind
  public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onNameChange(e.target.value);
  }
}

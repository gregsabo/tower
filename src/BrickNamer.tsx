import autobind from "autobind-decorator";
import * as React from "react";
import "./BrickNamer.css";
import { EditorMode } from "./Types";

interface IProps {
  name: string;
  onBrickNameChange: (value: string) => any;
  editorMode: EditorMode;
}


export default class BrickNamer extends React.Component<IProps> {
  private input: HTMLInputElement | null = null;

  public render() {
    return (
      <input
        className="BrickNamer"
        placeholder="Untitled Brick"
        onChange={this.handleChange}
        value={this.props.name}
        ref={input => (this.input = input)}
        type="text"
      />
    );
  }

  public componentDidUpdate(oldProps: IProps) {
    if (
      this.props.editorMode === "naming" &&
      this.props.editorMode !== oldProps.editorMode &&
      this.input
    ) {
      this.input.focus();
    }
    if (
      this.props.editorMode !== "naming" &&
      this.props.editorMode !== oldProps.editorMode &&
      this.input
    ) {
      this.input.blur();
    }
  }

  @autobind
  public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onBrickNameChange(e.target.value);
  }
}

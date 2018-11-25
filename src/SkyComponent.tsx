// import autobind from 'autobind-decorator';
import * as React from "react";
import "./SkyComponent.css";
import { Placeable, EditorMode, ILibrary, IModules } from "./Types";
import { BrickComponent } from "./BrickComponent";

interface IProps {
  contents: Placeable | null;
  editorMode: EditorMode;
  library: ILibrary;
  modules: IModules;
}

export default class SkyComponent extends React.Component<IProps> {
  public render() {
    if (this.props.contents === null) {
      return <div />;
    } else {
      return (
        <BrickComponent
          contents={this.props.contents}
          editorMode={this.props.editorMode}
          library={this.props.library}
          modules={this.props.modules}
        />
      );
    }
  }
}

// import autobind from 'autobind-decorator';
import * as React from "react";
import "./SkyComponent.css";
import { EditorMode, ILibrary, IModules } from "./Types";
import { BrickComponent } from "./BrickComponent";
import { Brick } from "./Brick";

interface IProps {
  contents: Brick | null;
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

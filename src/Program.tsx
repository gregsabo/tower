import * as React from "react";
import { BrickComponent } from "./BrickComponent";
import "./Program.css";
import {
  ILibrary,
  IModules,
  EditorMode,
  LibraryKey,
  ITower,
  ModuleKey,
  TowerKey
} from "./Types";
import TowerPath from "./TowerPath";
import { Socket } from "./Socket";
import { checkTypes } from "./Typechecking";

interface IProps {
  contents: ITower;
  editorMode: EditorMode;
  onCanInserted: (path: TowerPath, libraryKey: LibraryKey) => void;
  cursorPath: TowerPath;
  library: ILibrary;
  modules: IModules;
  currentModuleKey: ModuleKey;
  currentTowerKey: TowerKey;
}

const style = {
  display: "flex",
  marginTop: "25px"
};

class Program extends React.Component<IProps, {}> {
  public render() {
    const rootContents = this.props.contents.rootBrick || new Socket();
    return (
      <div>
        <div style={style}>
          <BrickComponent
            contents={rootContents}
            path={TowerPath.forRoot()}
            editorMode={this.props.editorMode}
            onCanInserted={this.props.onCanInserted}
            cursorPath={this.props.cursorPath}
            library={this.props.library}
            modules={this.props.modules}
            currentModuleKey={this.props.currentModuleKey}
            currentTowerKey={this.props.currentTowerKey}
            errors={checkTypes(rootContents, this.props.library, this.props.modules)}
          />
        </div>
      </div>
    );
  }
}

export default Program;

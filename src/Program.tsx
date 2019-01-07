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
    return (
      <div>
        <div style={style}>
          <BrickComponent
            contents={this.props.contents.rootBrick || new Socket()}
            path={TowerPath.forRoot()}
            editorMode={this.props.editorMode}
            onCanInserted={this.props.onCanInserted}
            cursorPath={this.props.cursorPath}
            library={this.props.library}
            modules={this.props.modules}
            currentModuleKey={this.props.currentModuleKey}
            currentTowerKey={this.props.currentTowerKey}
          />
        </div>
      </div>
    );
  }
}

export default Program;

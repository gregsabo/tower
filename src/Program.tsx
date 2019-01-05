import * as React from "react";
import { BrickComponent } from "./BrickComponent";
import "./Program.css";
import {
  ILibrary,
  IModules,
  EditorMode,
  UniqueId,
  LibraryKey,
  ITower,
  ModuleKey,
  TowerKey
} from "./Types";

interface IProps {
  contents: ITower;
  editorMode: EditorMode;
  onCanInserted: (selected: UniqueId, libraryKey: LibraryKey) => void;
  canCursorId: string;
  library: ILibrary;
  modules: IModules;
  currentModuleKey: ModuleKey;
  currentTowerKey: TowerKey;
}

const style = {
  display: "flex",
  marginTop: "50px"
};

class Program extends React.Component<IProps, {}> {
  public render() {
    return (
      <div>
        <div style={style}>
          <BrickComponent
            contents={this.props.contents.rootBrick}
            editorMode={this.props.editorMode}
            onCanInserted={this.props.onCanInserted}
            canCursorId={this.props.canCursorId}
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

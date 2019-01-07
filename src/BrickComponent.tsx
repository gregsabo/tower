// import autobind from "autobind-decorator";
import * as React from "react";
import { Input } from "./Input";
import { InputBrickComponent } from "./InputBrickComponent";
import "./BrickComponent.css";
import { BrickSearch } from "./BrickSearch";
import { Constant } from "./Constant";
import { ConstantBrickComponent } from "./ConstantBrickComponent";
import { Cork } from "./Cork";
import { CorkBrickComponent } from "./CorkBrickComponent";
import { Invocation } from "./Invocation";
import { InvocationBrickComponent } from "./InvocationBrickComponent";
import { Socket } from "./Socket";
import { SocketComponent } from "./SocketComponent";
import {
  EditorMode,
  ILibrary,
  IModules,
  LibraryKey,
  ModuleKey,
  TowerKey
} from "./Types";
import { Brick } from "./Brick";
import TowerPath from "./TowerPath";

interface IProps {
  contents: Brick;
  path: TowerPath;
  editorMode: EditorMode;
  onCanInserted?: (path: TowerPath, libraryKey: LibraryKey) => void;
  library: ILibrary;
  modules: IModules;
  currentModuleKey: ModuleKey;
  currentTowerKey: TowerKey;
  cursorPath: TowerPath | null;
}

function renderCanSearch(props: IProps) {
  if (props.editorMode !== "insert") {
    return null;
  }
  if (!props.path.equals(props.cursorPath)) {
    return null;
  }
  if (props.onCanInserted === undefined) {
    return null;
  }
  return (
    <BrickSearch
      library={props.library}
      modules={props.modules}
      onLibraryItemSelected={props.onCanInserted.bind(
        null,
        props.contents.uniqueId
      )}
    />
  );
}

function renderBrick(props: IProps) {
  const contents = props.contents;
  if (contents instanceof Socket) {
    return <SocketComponent {...props} contents={contents} />;
  } else if (contents instanceof Input) {
    return <InputBrickComponent {...props} contents={contents} />;
  } else if (contents instanceof Cork) {
    return <CorkBrickComponent {...props} contents={contents} />;
  } else if (contents instanceof Constant) {
    return <ConstantBrickComponent {...props} contents={contents} />;
  } else if (contents instanceof Invocation) {
    return <InvocationBrickComponent {...props} contents={contents} />;
  }
  throw new Error("Couldn't understand this invocation to render.");
}

export const BrickComponent: React.SFC<IProps> = props => {
  return (
    <div className="BrickComponent">
      {renderCanSearch(props)}
      {renderBrick(props)}
    </div>
  );
};

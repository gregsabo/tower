import classnames from "classnames";
import * as React from "react";
import "./ConstantBrickComponent.css";
import { EditorMode, ILibrary, IModules, LibraryKey } from "./Types";
import Value from "./Value";
import { Constant } from "./Constant";
import TowerPath from "./TowerPath";

interface IProps {
  contents: Constant;
  path: TowerPath;
  cursorPath: TowerPath | null;
  editorMode: EditorMode;
  onCanInserted?: (path: TowerPath, libraryKey: LibraryKey) => void;
  library: ILibrary;
  modules: IModules;
}

export const ConstantBrickComponent: React.SFC<IProps> = props => {
  const selected = props.path.equals(props.cursorPath);
  return (
    <div
      className={classnames("ConstantBrickComponent", {
        "is-selected": selected
      })}
    >
      <Value value={props.contents.value} />
    </div>
  );
};

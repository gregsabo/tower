import classnames from "classnames";
import * as React from "react";
import "./CorkBrickComponent.css";
import { EditorMode, ILibrary, IModules, LibraryKey } from "./Types";
import { Cork } from "./Cork";
import TowerPath from "./TowerPath";
import { ITypecheck } from "./Typechecking";

interface IProps {
  contents: Cork;
  path: TowerPath;
  cursorPath: TowerPath | null;
  editorMode: EditorMode;
  onCanInserted?: (path: TowerPath, libraryKey: LibraryKey) => void;
  library: ILibrary;
  modules: IModules;
  errors: ITypecheck;
}

export const CorkBrickComponent: React.SFC<IProps> = props => {
  const selected = props.path.equals(props.cursorPath);
  return (
    <div
      className={classnames("CorkBrickComponent", { "is-selected": selected })}
    />
  );
};

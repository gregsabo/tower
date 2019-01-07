import classnames from "classnames";
import * as React from "react";
import "./SocketComponent.css";
import { EditorMode, ILibrary, IModules, LibraryKey } from "./Types";
import { Socket } from "./Socket";
import TowerPath from "./TowerPath";

interface IProps {
  contents: Socket;
  path: TowerPath;
  cursorPath: TowerPath | null;
  editorMode: EditorMode;
  onCanInserted?: (path: TowerPath, libraryKey: LibraryKey) => void;
  library: ILibrary;
  modules: IModules;
}

export const SocketComponent: React.SFC<IProps> = props => {
  const selected = props.path.equals(props.cursorPath);
  return (
    <div
      className={classnames("SocketComponent", { "is-selected": selected })}
    />
  );
};

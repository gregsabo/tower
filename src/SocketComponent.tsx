import classnames from "classnames";
import * as React from "react";
import "./SocketComponent.css";
import { EditorMode, ILibrary, IModules, LibraryKey, UniqueId } from "./Types";
import { Socket } from "./Socket";

interface IProps {
  contents: Socket;
  editorMode: EditorMode;
  onCanInserted?: (selected: UniqueId, libraryKey: LibraryKey) => void;
  canCursorId?: string;
  library: ILibrary;
  modules: IModules;
}

export const SocketComponent: React.SFC<IProps> = props => {
  const selected = props.contents.uniqueId === props.canCursorId;
  return (
    <div
      className={classnames("SocketComponent", { "is-selected": selected })}
    />
  );
};

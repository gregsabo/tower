import * as React from "react";
import { ILibrary, IModules, EditorMode, UniqueId, LibraryKey } from "./Types";
import "./InputBrickComponent.css";
import classnames from "classnames";
import { Input } from "./Input";

interface IProps {
  contents: Input;
  editorMode: EditorMode;
  onCanInserted?: (selected: UniqueId, libraryKey: LibraryKey) => void;
  canCursorId?: string;
  library: ILibrary;
  modules: IModules;
}

export const InputBrickComponent: React.SFC<IProps> = props => {
  const selected = props.canCursorId === props.contents.uniqueId;
  return (
    <div
      className={classnames("InputBrickComponent", { "is-selected": selected })}
    >
      INPUT
    </div>
  );
};

import * as React from "react";
import { ILibrary, IModules, EditorMode, UniqueId, LibraryKey } from "./Types";
import "./ArgBrickComponent.css";
import classnames from "classnames";
import { Arg } from "./Arg";

interface IProps {
  contents: Arg;
  editorMode: EditorMode;
  onCanInserted?: (selected: UniqueId, libraryKey: LibraryKey) => void;
  canCursorId?: string;
  library: ILibrary;
  modules: IModules;
}

export const ArgBrickComponent: React.SFC<IProps> = props => {
  const selected = props.canCursorId === props.contents.uniqueId;
  return (
    <div
      className={classnames("ArgBrickComponent", { "is-selected": selected })}
    >
      ARG
    </div>
  );
};

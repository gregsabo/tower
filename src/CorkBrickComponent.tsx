import classnames from "classnames";
import * as React from "react";
import "./CorkBrickComponent.css";
import { EditorMode, ILibrary, IModules, LibraryKey, UniqueId } from "./Types";
import { Cork } from "./Cork";

interface IProps {
  contents: Cork;
  editorMode: EditorMode;
  onCanInserted?: (selected: UniqueId, libraryKey: LibraryKey) => void;
  canCursorId?: string;
  library: ILibrary;
  modules: IModules;
}

export const CorkBrickComponent: React.SFC<IProps> = props => {
  const selected = props.canCursorId === props.contents.uniqueId;
  return (
    <div
      className={classnames("CorkBrickComponent", { "is-selected": selected })}
    />
  );
};

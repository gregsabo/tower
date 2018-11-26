import classnames from "classnames";
import * as React from "react";
import "./ConstantBrickComponent.css";
import { EditorMode, ILibrary, IModules, LibraryKey, UniqueId } from "./Types";
import Value from "./Value";
import { Constant } from "./Constant";

interface IProps {
  contents: Constant;
  editorMode: EditorMode;
  onCanInserted?: (selected: UniqueId, libraryKey: LibraryKey) => void;
  canCursorId?: string;
  library: ILibrary;
  modules: IModules;
}

export const ConstantBrickComponent: React.SFC<IProps> = props => {
  const selected = props.canCursorId === props.contents.uniqueId;
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

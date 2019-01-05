import * as React from "react";
import {
  ILibrary,
  IModules,
  EditorMode,
  UniqueId,
  LibraryKey,
  ModuleKey,
  TowerKey
} from "./Types";
import "./InputBrickComponent.css";
import classnames from "classnames";
import { Input } from "./Input";
import { getTowerFromModules } from "./Modules";

interface IProps {
  contents: Input;
  editorMode: EditorMode;
  onCanInserted?: (selected: UniqueId, libraryKey: LibraryKey) => void;
  canCursorId?: string;
  library: ILibrary;
  modules: IModules;
  currentModuleKey: ModuleKey;
  currentTowerKey: TowerKey;
}

function parameterConfig(props: IProps) {
  const tower = getTowerFromModules(
    props.currentModuleKey,
    props.currentTowerKey,
    props.modules
  );
  if (typeof tower === "undefined" || typeof tower.inputs === "undefined") {
    return null;
  }
  return tower.inputs.find(i => {
    return i.key === props.contents.inputKey;
  });
}

export const InputBrickComponent: React.SFC<IProps> = props => {
  const selected = props.canCursorId === props.contents.uniqueId;
  const parameter = parameterConfig(props);
  return (
    <div
      className={classnames("InputBrickComponent", { "is-selected": selected })}
    >
      <div className="InputBrickComponent-arrow" />
      <div className="InputBrickComponent-name">
        {parameter ? parameter.displayName : ""}
      </div>
    </div>
  );
};

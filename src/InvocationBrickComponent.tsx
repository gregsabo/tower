import classnames from "classnames";
import * as React from "react";
import { BrickComponent } from "./BrickComponent";
import { Invocation } from "./Invocation";
import "./InvocationBrickComponent.css";
import {
  EditorMode,
  ILibrary,
  IModules,
  LibraryKey,
  UniqueId,
  ModuleKey,
  TowerKey
} from "./Types";
import { Brick } from "./Brick";

interface IProps {
  contents: Invocation;
  editorMode: EditorMode;
  onCanInserted?: (selected: UniqueId, libraryKey: LibraryKey) => void;
  canCursorId?: string;
  library: ILibrary;
  modules: IModules;
  currentModuleKey: ModuleKey;
  currentTowerKey: TowerKey;
}

function renderName(props: IProps) {
  return props.contents.getName(props.library, props.modules);
}

function renderInputs(props: IProps) {
  if (!props.contents.inputs) {
    return null;
  }
  const inputs = props.contents.getOrderedInputs(props.library, props.modules);
  return inputs.map((item: Brick, i: number) => {
    return (
      <span key={i} className="InvocationBrickComponent-input">
        <BrickComponent
          canCursorId={props.canCursorId}
          contents={item}
          editorMode={props.editorMode}
          onCanInserted={props.onCanInserted}
          library={props.library}
          modules={props.modules}
          currentModuleKey={props.currentModuleKey}
          currentTowerKey={props.currentTowerKey}
        />
      </span>
    );
  });
}

function selectable(selected: boolean, className: string) {
  return classnames(className, { "is-selected": selected });
}

export const InvocationBrickComponent: React.SFC<IProps> = props => {
  const s = selectable.bind(
    null,
    props.contents.uniqueId === props.canCursorId
  );

  return (
    <div className={s("InvocationBrickComponent")}>
      <div className="InvocationBrickComponent-inputList">
        {renderInputs(props)}
      </div>
      <div className={s("InvocationBrickComponent-top")} />
      <div className={s("InvocationBrickComponent-side")}>
        <div className={s("InvocationBrickComponent-topFront")} />
        <div className={s("InvocationBrickComponent-name")}>
          {renderName(props)}
        </div>
      </div>
    </div>
  );
};

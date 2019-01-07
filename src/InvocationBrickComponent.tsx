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
  ModuleKey,
  TowerKey,
  IInputConfiguration
} from "./Types";
import TowerPath from "./TowerPath";
import { Socket } from "./Socket";

interface IProps {
  contents: Invocation;
  path: TowerPath;
  editorMode: EditorMode;
  onCanInserted?: (path: TowerPath, libraryKey: LibraryKey) => void;
  cursorPath: TowerPath | null;
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
  const inputConfigs = props.contents.getInputConfiguration(
    props.library,
    props.modules
  );
  return inputConfigs.map((config: IInputConfiguration, i: number) => {
    const input = props.contents.inputs[config.key];
    return (
      <span key={i} className="InvocationBrickComponent-input">
        <BrickComponent
          cursorPath={props.cursorPath}
          path={props.path.plus(config.key)}
          contents={input || new Socket()}
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
  const s = selectable.bind(null, props.path.equals(props.cursorPath));

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

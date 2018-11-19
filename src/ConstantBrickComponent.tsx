import * as React from "react";
import {IConstant, ILibrary, IModules} from "./Types";
import Value from "./Value";
import "./ConstantBrickComponent.css";
import classnames from "classnames";

interface IProps {
    contents: IConstant;
    editorMode: string;
    onCanInserted: any;
    canCursorId: string;
    library: ILibrary;
    modules: IModules;
}

export const ConstantBrickComponent: React.SFC<IProps> = (props) => {
    const selected = props.canCursorId === props.contents.uniqueId;
    return <div className={classnames("ConstantBrickComponent", {"is-selected": selected})}>
        <Value value={props.contents.value}/>
    </div>
}
import * as React from "react";
import {IConstant} from "./Types";
import Value from "./Value";
import "./ConstantBrickComponent.css";
import classnames from "classnames";

interface IProps {
    contents: IConstant;
    editorMode: string;
    onCanClick: any;
    onCanInserted: any;
    canCursorId: string;
    library: any;
    modules: any;
}

export const ConstantBrickComponent: React.SFC<IProps> = (props) => {
    const selected = props.canCursorId === props.contents.uniqueId;
    return <div className={classnames("ConstantBrickComponent", {"is-selected": selected})}>
        <Value value={props.contents.value}/>
    </div>
}
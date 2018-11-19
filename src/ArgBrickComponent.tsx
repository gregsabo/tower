import * as React from "react";
import {IArg} from "./Types";
import "./ArgBrickComponent.css";
import classnames from "classnames";

interface IProps {
    contents: IArg;
    editorMode: string;
    onCanClick: any;
    onCanInserted: any;
    canCursorId: string;
    library: any;
    modules: any;
}

export const ArgBrickComponent: React.SFC<IProps> = (props) => {
    const selected = props.canCursorId === props.contents.uniqueId;
    return <div className={classnames("ArgBrickComponent", {"is-selected": selected})}>
        ARG
    </div>;

}
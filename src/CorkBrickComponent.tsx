import * as React from "react";
import classnames from "classnames";
import {ICork} from "./Types";
import "./CorkBrickComponent.css";

interface IProps {
    contents: ICork;
    editorMode: string;
    onCanClick: any;
    onCanInserted: any;
    canCursorId: string;
    library: any;
    modules: any;
}

export const CorkBrickComponent: React.SFC<IProps> = (props) => {
    const selected = props.canCursorId === props.contents.uniqueId;
    return <div className={classnames("CorkBrickComponent", {"is-selected": selected})}>
        CORK
    </div>;

}
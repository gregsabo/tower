import * as React from "react";
import {ISocket} from "./Types";
import classnames from "classnames";
import "./SocketComponent.css";

interface IProps {
    contents: ISocket;
    editorMode: string;
    onCanInserted: any;
    canCursorId: string;
    library: any;
    modules: any;
}

export const SocketComponent: React.SFC<IProps> = (props) => {
    const selected = props.contents.uniqueId === props.canCursorId;
    return <div className={classnames("SocketComponent", {"is-selected": selected})}/>
}
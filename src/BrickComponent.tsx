// import autobind from "autobind-decorator";
import * as React from "react";
import "./BrickComponent.css";

import Arg from "./Arg";
import {BrickSearch} from "./BrickSearch";
import Constant from "./Constant";
import Cork from "./Cork";
import Invocation from "./Invocation";
import Socket from "./Socket";

import {IInvocation, ISocket, IConstant, IArg} from "./Types";
import { InvocationBrickComponent } from "./InvocationBrickComponent";
import { SocketComponent } from "./SocketComponent";
import { ConstantBrickComponent } from "./ConstantBrickComponent";
import { ArgBrickComponent } from "./ArgBrickComponent";
import { CorkBrickComponent } from "./CorkBrickComponent";

interface IProps {
    contents: IInvocation|ISocket|IConstant|IArg;
    editorMode: string;
    onCanClick: any;
    onCanInserted: any;
    canCursorId: string;
    library: any;
    modules: any;
}

function renderCanSearch(props: IProps) {
    if (props.editorMode !== "insert") {
        return null;
    }
    if (props.contents.uniqueId !== props.canCursorId) {
        return null;
    }
    return <BrickSearch
        library={props.library}
        modules={props.modules}
        onLibraryItemSelected={props.onCanInserted.bind(null, props.contents.uniqueId)}/>;
}

function renderBrick(props: IProps) {
    if (Socket.describes(props.contents)) {
        return <SocketComponent
            {...props}
            contents={props.contents as ISocket}
        />
    } else if (Arg.describes(props.contents)) {
        return <ArgBrickComponent
            {...props}
            contents={props.contents as IArg}
        />
    } else if (Cork.describes(props.contents)) {
        return <CorkBrickComponent
            {...props}
            contents={props.contents as IConstant}
        />

    } else if (Constant.describes(props.contents)) {
        return <ConstantBrickComponent
            {...props}
            contents={props.contents as IConstant}
        />

    } else if (Invocation.describes(props.contents)) {
        return <InvocationBrickComponent 
            {...props} 
            contents={props.contents as IInvocation}
        />
    }
    throw new Error("Couldn't understand this invocation to render.")
}


export const BrickComponent: React.SFC<IProps> = (props) => {
    return <div className="BrickComponent">
        {renderCanSearch(props)}
        {renderBrick(props)}
    </div>
}
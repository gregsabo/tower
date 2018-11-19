// import autobind from "autobind-decorator";
import * as React from "react";
import Arg from "./Arg";
import { ArgBrickComponent } from "./ArgBrickComponent";
import "./BrickComponent.css";
import { BrickSearch } from "./BrickSearch";
import Constant from "./Constant";
import { ConstantBrickComponent } from "./ConstantBrickComponent";
import Cork from "./Cork";
import { CorkBrickComponent } from "./CorkBrickComponent";
import Invocation from "./Invocation";
import { InvocationBrickComponent } from "./InvocationBrickComponent";
import Socket from "./Socket";
import { SocketComponent } from "./SocketComponent";
import { EditorMode, IArg, IConstant, IInvocation, ILibrary, IModules, ISocket, LibraryKey, UniqueId } from "./Types";



interface IProps {
    contents: IInvocation|ISocket|IConstant|IArg;
    editorMode: EditorMode;
    onCanInserted: (selected: UniqueId, libraryKey: LibraryKey) => void;
    canCursorId: string;
    library: ILibrary;
    modules: IModules;
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
import * as React from "react";
import {IArg, ILibrary, IModules, EditorMode, UniqueId, LibraryKey} from "./Types";
import "./ArgBrickComponent.css";
import classnames from "classnames";

interface IProps {
    contents: IArg;
    editorMode: EditorMode;
    onCanInserted: (selected: UniqueId, libraryKey: LibraryKey) => void;
    canCursorId: string;
    library: ILibrary;
    modules: IModules;
}

export const ArgBrickComponent: React.SFC<IProps> = (props) => {
    const selected = props.canCursorId === props.contents.uniqueId;
    return <div className={classnames("ArgBrickComponent", {"is-selected": selected})}>
        ARG
    </div>;

}
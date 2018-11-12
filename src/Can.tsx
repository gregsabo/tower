import autobind from "autobind-decorator";
import * as React from "react";
import "./Can.css";

import Arg from "./Arg";
import CanSearch from "./CanSearch";
import Constant from "./Constant";
import Cork from "./Cork";
import Invocation from "./Invocation";
import Socket from "./Socket";

interface IProps {
    contents: any;
    editorMode: string;
    onSocketClick: any;
    onCanClick: any;
    onCanInserted: any;
    canCursorId: string;
    library: any;
    modules: any;
}

const log = console.log;

class Can extends React.Component<IProps, {}> {
    public contents: any;

    public render() {
        const onCanClick = (e: any) => {
            log(e.target);
            e.stopPropagation();
            this.props.onCanClick(this.props.contents);
        };

        const isSelected = this.props.contents.uniqueId === this.props.canCursorId;
        if (Socket.describes(this.props.contents)) {
            return this.renderSocket(isSelected);
        }
        if (Constant.describes(this.props.contents)) {
            return this.renderConstant(isSelected);
        }

        let className = "Can";
        if (isSelected) {
            className = "Can Can--isSelected";
        }

        return <div className={className} onClick={onCanClick}>
            {this.renderBody()}
        </div>;
    }

    public renderBody() {
        return <div>
            {this.maybeRenderCanSearch()}
            <div className="Can-argList">
                {this.renderArgs()}
            </div>
            <div className="Can-top"/>
            <div className="Can-side">
                {this.maybeRenderCursor()}
                <div className="Can-topFront"/>
                <div className="Can-name">
                    {this.renderName()}
                </div>
            </div>
        </div>;
    }

    public maybeRenderCanSearch() {
        if (this.props.editorMode !== "insert") {
            return null;
        }
        if (this.props.contents.uniqueId !== this.props.canCursorId) {
            return null;
        }
        return <CanSearch
            library={this.props.library}
            modules={this.props.modules}
            onLibraryItemSelected={this.onLibraryItemSelected}/>;
    }

    @autobind
    public onLibraryItemSelected(selected: string) {
        return this.props.onCanInserted(this.props.contents.uniqueId, selected);
    }

    public renderArgs() {
        if (!this.props.contents.args) {
            return null;
        }
        return this.props.contents.args.map((item: any, i: number) => {
            return <span key={i} className="Can-arg">
                <Can
                    canCursorId={this.props.canCursorId}
                    contents={item}
                    editorMode={this.props.editorMode}
                    onSocketClick={this.props.onSocketClick}
                    onCanClick={this.props.onCanClick}
                    onCanInserted={this.props.onCanInserted}
                    library={this.props.library}
                    modules={this.props.modules}
                />
            </span>;
        });
    }

    public renderSocket(isSelected: boolean) {
        const onClickedMe = (e: any) => {
            log("Clicked a socket");
            e.stopPropagation();
            this.props.onSocketClick(this.props.contents);
        };
        let className = "Can-socket";
        if (isSelected) {
            className = "Can-socket Can-socket--isSelected";
        }
        return <div className={className}>
            {this.maybeRenderCanSearch()}
            <div className="Can-socketDisplay" onClick={onClickedMe}/>
        </div>;
    }

    public renderConstant(isSelected: boolean) {
        let className = "Can-constant";
        if (isSelected) {
            className = "Can-constant Can-constant--isSelected";
        }
        return <div className={className}>
            {this.maybeRenderCanSearch()}
            <div className="Can-constantDisplay">
                {this.props.contents.value}
            </div>
        </div>;
    }

    public renderName() {
        if (Invocation.describes(this.props.contents)) {
            return Invocation.getName(
                this.props.contents,
                this.props.library,
                this.props.modules
            );
        }
        if (Arg.describes(this.props.contents)) {
            return "ARG";
        }
        if (Cork.describes(this.props.contents)) {
            return "CORK";
        }
        const contents = this.props.contents.value;
        if (typeof contents === "number") {
            return contents;
        }
        return '"' + String(contents) + '"';
    }

    private maybeRenderCursor() {
        if (this.props.contents.uniqueId !== this.props.canCursorId) {
            return null;
        }
        return <div className="Can-cursor"/>;
    }

}

export default Can;

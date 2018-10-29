import * as React from "react";
import "./Can.css";

import Arg from "./Arg";
import Cork from "./Cork";
import Invocation from "./Invocation";
import Socket from "./Socket";

interface IProps {
    contents: any;
    onSocketClick: any;
    onCanClick: any;
    canCursorId: string;
    library: any;
    modules: any;
}

const log = console.log;

class Can extends React.Component<IProps, {}> {
    public contents: any;

    public render() {
        if (Socket.describes(this.props.contents)) {
            return this.renderSocket();
        }
        const onCanClick = (e: any) => {
            log(e.target);
            e.stopPropagation();
            this.props.onCanClick(this.props.contents);
        };
        let className = "Can";
        if (this.props.contents.uniqueId === this.props.canCursorId) {
            className = "Can Can--isSelected";
        }

        return <div className={className} onClick={onCanClick}>
            {this.renderBody()}
        </div>;
    }

    public renderBody() {
        return <div>
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

    public renderArgs() {
        if (!this.props.contents.args) {
            return null;
        }
        return this.props.contents.args.map((item: any, i: number) => {
            return <span key={i} className="Can-arg">
                <Can
                    canCursorId={this.props.canCursorId}
                    contents={item}
                    onSocketClick={this.props.onSocketClick}
                    onCanClick={this.props.onCanClick}
                    library={this.props.library}
                    modules={this.props.modules}
                />
            </span>;
        });
    }

    public renderSocket() {
        const onClickedMe = (e: any) => {
            log("Clicked a socket");
            e.stopPropagation();
            this.props.onSocketClick(this.props.contents);
        };
        let className = "Can-socket";
        if (this.props.contents.uniqueId === this.props.canCursorId) {
            className = "Can-socket Can-socket--isSelected";
        }
        return <div className={className}>
            <div className="Can-socketDisplay" onClick={onClickedMe}/>
        </div>;
    }

    public renderName() {
        if (Invocation.describes(this.props.contents)) {
            console.log("Getting name for", this.props.contents, this.props.library, this.props.modules);
            return Invocation.getName(
                this.props.contents,
                this.props.library,
                this.props.modules
            );
        }
        if (this.props.contents instanceof Arg) {
            return "ARG";
        }
        if (this.props.contents instanceof Cork) {
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

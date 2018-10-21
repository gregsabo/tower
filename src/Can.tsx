import * as React from "react";
import "./Can.css";

import Arg from "./Arg";
import Cork from "./Cork";
import Socket from "./Socket";

interface IProps {
    contents: any;
    onSocketClick: any;
    onCanClick: any;
}

const log = console.log;

class Can extends React.Component<IProps, {}> {
    public contents: any;

    public render() {
        if (this.props.contents instanceof Socket) {
            return this.renderSocket();
        }
        const onCanClick = (e: any) => {
            log(e.target);
            e.stopPropagation();
            this.props.onCanClick(this.props.contents);
        };
        return <div className="Can" onClick={onCanClick}>
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
                <Can contents={item} onSocketClick={this.props.onSocketClick} onCanClick={this.props.onCanClick}/>
            </span>;
        });
    }

    public renderSocket() {
        const onClickedMe = (e: any) => {
            log("Clicked a socket");
            e.stopPropagation();
            this.props.onSocketClick(this.props.contents);
        };
        return <div className="Can-socket" onClick={onClickedMe}/>;
    }

    public renderName() {
        if (this.props.contents.isInvocation) {
            return this.props.contents.libraryFunction.name;
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
}

export default Can;

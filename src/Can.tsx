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

const style = {
    border: "1px solid black",
    "borderRadius": "5px 5px 0 0",
    "borderTop": "10px solid black",
    display: "inline-block",
    "fontFamily": "monospace",
    margin: "10px",
    padding: "10px"
};

const styleArg = {
    display: "inline"
};

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
        return <div className="Can" style={style} onClick={onCanClick}>
            {this.props.contents.isInvocation
                ? this.renderInvocation()
                : this.renderConst()
            }
        </div>;
    }

    public renderInvocation() {
        return <div>
            <div className="Can-argList">
                {this.props.contents.args.map((item: any, i: number) => {
                    return <span key={i} className="Can-arg" style={styleArg}>
                        <Can contents={item} onSocketClick={this.props.onSocketClick} onCanClick={this.props.onCanClick}/>
                    </span>;
                })}
            </div>
            <div className="Can-name">
                {this.props.contents.libraryFunction.name}
            </div>
        </div>;
    }

    public renderSocket() {
        const onClickedMe = (e: any) => {
            log("Clicked a socket");
            e.stopPropagation();
            this.props.onSocketClick(this.props.contents);
        }
        return <div className="Can-socket" onClick={onClickedMe}/>;
    }

    public renderConst() {
        if (this.props.contents instanceof Arg) {
            return "ARG";
        }
        if (this.props.contents instanceof Cork) {
            return "CORK";
        }
        const contents = this.props.contents.value;
        return contents.implementation === undefined
            ? '"' + String(contents) + '"'
            : contents.name;
    }
}

export default Can;

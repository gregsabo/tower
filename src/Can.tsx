import * as React from "react";
import "./Can.css";

import Arg from "./Arg";
import Socket from "./Socket";

interface IProps {
    contents: any;
    onSocketClick: any;
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

class Can extends React.Component<IProps, {}> {
    public contents: any;

    public render() {
        if (this.props.contents instanceof Socket) {
            return this.renderSocket();
        }
        return <div className="Can" style={style}>
            {this.props.contents.isInvocation
                ? this.renderInvocation()
                : this.renderConst()
            }
        </div>;
    }

    public renderInvocation() {
        return <div>
            {this.props.contents.args.map((item: any, i: number) => {
                return <span key={i} className="Can-arg" style={styleArg}>
                    <Can contents={item} onSocketClick={this.props.onSocketClick}/>
                </span>;
            })}
            <div className="Can-name">
                {this.props.contents.libraryFunction.name}
            </div>
        </div>;
    }

    public renderSocket() {
        const onClickedMe = () => this.props.onSocketClick(this.props.contents);
        return <div className="Can-socket" onClick={onClickedMe}/>;
    }

    public renderConst() {
        if (this.props.contents instanceof Arg) {
            return "ARG";
        }
        return this.props.contents.implementation === undefined
            ? '"' + String(this.props.contents) + '"'
            : this.props.contents.name;
    }
}

export default Can;

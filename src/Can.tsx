import * as React from "react";

interface IProps {
    contents: any;
}

const log = console.log;

const style = {
    border: "1px solid black",
    "border-radius": "5px 5px 0 0",
    "border-top": "10px solid black",
    display: "inline-block",
    "font-family": "monospace",
    margin: "10px",
    padding: "10px"
};

const styleArg = {
    display: "inline"
};

class Can extends React.Component<IProps, {}> {
    public contents: any;

    public render() {
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
                    <Can contents={item}/>
                </span>;
            })}
            <div className="Can-name">
                {this.props.contents.libraryFunction.name}
            </div>
        </div>;
    }

    public renderConst() {
        log("Rendering const:", this.props.contents.name, this.props.contents);
        return this.props.contents.implementation === undefined
            ? '"' + String(this.props.contents) + '"'
            : this.props.contents.name;
    }
}

export default Can;

import * as React from "react";
import Can from "./Can";

interface IProps {
    contents: any;
    onSocketClick: any;
    onCanClick: any;
}

const style = {
    display: "flex"
};

class Program extends React.Component<IProps, {}> {
    public render() {
        return <div style={style}>
            <Can contents={this.props.contents} onSocketClick={this.props.onSocketClick} onCanClick={this.props.onCanClick}/>
        </div>;
    }
}

export default Program;

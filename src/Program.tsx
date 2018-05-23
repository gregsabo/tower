import * as React from "react";
import Can from "./Can";

interface IProps {
    contents: any;
}

const style = {
    display: "flex"
};

class Program extends React.Component<IProps, {}> {
    public render() {
        return <div style={style}>
            <Can contents={this.props.contents}/>
        </div>;
    }
};

export default Program;

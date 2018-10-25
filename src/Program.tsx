import * as React from "react";
import Can from "./Can";

interface IProps {
    contents: any;
    onSocketClick: any;
    onCanClick: any;
    canCursorId: string;
    library: any;
}

const style = {
    display: "flex",
    marginTop: "50px"
};

class Program extends React.Component<IProps, {}> {
    public render() {
        return <div style={style}>
            <Can
                contents={this.props.contents}
                onSocketClick={this.props.onSocketClick}
                onCanClick={this.props.onCanClick}
                canCursorId={this.props.canCursorId}
                library={this.props.library}
            />
        </div>;
    }
}

export default Program;

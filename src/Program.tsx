import autobind from "autobind-decorator";
import * as React from "react";
import Can from "./Can";
import "./Program.css";

interface IProps {
    contents: any;
    editorMode: string;
    onSocketClick: any;
    onCanClick: any;
    onCanInserted: any;
    onBrickNameChange: any;
    canCursorId: string;
    library: any;
    modules: any;
}

const style = {
    display: "flex",
    marginTop: "50px"
};

class Program extends React.Component<IProps, {}> {
    public render() {
        return <div>
            <div style={style}>
                <Can
                    contents={this.props.contents.rootInvocation}
                    editorMode={this.props.editorMode}
                    onSocketClick={this.props.onSocketClick}
                    onCanClick={this.props.onCanClick}
                    onCanInserted={this.props.onCanInserted}
                    canCursorId={this.props.canCursorId}
                    library={this.props.library}
                    modules={this.props.modules}
                />
            </div>
            <input
                className="App-brickNameInput"
                placeholder="Untitled Brick"
                onChange={this.onBrickNameChange}
                value={this.props.contents.name}
            />
        </div>;
    }

    @autobind
    public onBrickNameChange(e: any) {
        this.props.onBrickNameChange(e.target.value);
    }
}

export default Program;

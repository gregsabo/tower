import * as React from "react";
import "./App.css";
import Arg from "./Arg";
import CanSearch from "./CanSearch";
import Invocation from "./Invocation";
import Library from "./Library";
import Program from "./Program";
import Socket from "./Socket";

const PROGRAMS = [
    new Invocation(Library.join, [
        new Invocation(Library.map, [
            new Invocation(Library.split, [
                new Arg()
            ]),
            Library.capitalize
        ]),
        " "
    ]),
    new Socket()
];

interface IState {
    highlightedLibraryItem: any;
    programs: any;
}
const log = console.log;
log("hi");

class App extends React.Component<{}, IState> {
    public componentDidMount() {
        this.setState({
            highlightedLibraryItem: Library.split,
            programs: PROGRAMS
        });
    }

    public render() {
        const highlight = this.highlightLibraryItem.bind(this);
        const appendProgram = this.appendProgram.bind(this);
        if (this.state === null) {
            return null;
        }
        const onSocketClick = this.onSocketClick.bind(this);
        return (
            <div style={{display: "flex"}}>
            <CanSearch library={Library} onLibraryItemHighlighted={highlight}/>
            <div>
            {this.state.programs.map((program: any, i: number) => {
                return <Program contents={program} key={i} onSocketClick={onSocketClick}/>;
            })}
            <button onClick={appendProgram}>+ Add program</button>
            </div>
            </div>
        );
    }

    public highlightLibraryItem(libraryItem: any) {
        this.setState({highlightedLibraryItem: libraryItem});
    }

    public appendProgram(e: any) {
        log("Adding program");
        log(this.state.programs.concat([new Socket()]));
        this.setState({
            programs: this.state.programs.concat([new Socket()])
        });
    }

    public invocationForHighlightedItem() {
        const item = this.state.highlightedLibraryItem;
        const numArgs = item.args;
        const args = [];
        for (let i = 0; i < numArgs; i++) {
            args.push(new Socket());
        }
        return new Invocation(item, args);
    }

    public onSocketClick(clickedSocket: any) {
        const programs = this.state.programs;
        const invocation = this.invocationForHighlightedItem();
        for (let i = 0; i < programs.length; i++) {
            if (programs[i].uniqueId === clickedSocket.uniqueId) {
                programs[i] = invocation;
                break;
            }
            log("finding in", programs, i);
            const found = this.findAndReplace(
                programs[i],
                clickedSocket,
                this.state.highlightedLibraryItem
            );
            if (found) {
                break;
            }
        }
        this.setState({programs});
    }

    public findAndReplace(program: any, socket: any, invocation: Invocation) {
        for (let i = 0; i < program.args.length; i++) {
            if (program.args[i].uniqueId === socket.uniqueId) {
                program.args[i] = invocation;
                return true;
            }
        }
        return false;
    }
}

export default App;

import * as React from "react";
import "./App.css";
import Arg from "./Arg";
import CanSearch from "./CanSearch";
import Constant from "./Constant";
import Cork from "./Cork";
import Executor from "./Executor";
import Invocation from "./Invocation";
import KeyboardController from "./KeyboardController";
import Library from "./Library";
import Program from "./Program";
import Socket from "./Socket";

const PROGRAMS = [
    new Invocation(Library.join, [
        new Invocation(Library.map, [
            new Invocation(Library.split, [
                new Arg()
            ]),
            new Invocation(Library.capitalize, [
                new Cork()
            ])
        ]),
        new Constant(" ")
    ]),
    new Socket()
];

interface IState {
    highlightedLibraryItem: any;
    canCursorId: string;
    programs: any;
}
const log = console.log;

class App extends React.Component<{}, IState> {
    public componentDidMount() {
        const keyboardController = new KeyboardController(this);
        keyboardController.registerKeyEvents();

        this.setState({
            canCursorId: PROGRAMS[0].uniqueId,
            highlightedLibraryItem: Library.split,
            programs: PROGRAMS
        });
    }

    public render() {
        const highlight = this.highlightLibraryItem.bind(this);
        const appendProgram = this.appendProgram.bind(this);
        const onCanClick = this.onCanClick.bind(this);
        if (this.state === null) {
            return null;
        }
        const onSocketClick = this.onSocketClick.bind(this);
        return (
            <div className="App" style={{display: "flex"}}>
                <CanSearch library={Library} onLibraryItemHighlighted={highlight}/>
                <div>
                    <Executor program={this.state.programs}/>
                    {this.state.programs.map((program: any, i: number) => {
                        return <Program
                            contents={program}
                            key={i}
                            onSocketClick={onSocketClick}
                            onCanClick={onCanClick}
                            canCursorId={this.state.canCursorId}
                        />;
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
        if (item.invocationGenerator) {
            return item.invocationGenerator();
        }
        const args = [];
        for (let i = 0; i < item.numArgs; i++) {
            args.push(new Socket());
        }
        return new Invocation(item, args);
    }

    public onSocketClick(clickedSocket: any) {
        const programs = this.state.programs;
        const invocation = this.invocationForHighlightedItem();
        this.listFindAndReplace(programs, clickedSocket, invocation);
        this.setState({programs});
    }

    public onCanClick(clickedInvocation: any) {
        log("Clicked a can", clickedInvocation);
        const programs = this.state.programs;
        this.listFindAndReplace(programs, clickedInvocation, new Socket());
        this.setState({programs});
    }

    public listFindAndReplace(programs: any, needle: any, invocation: any) {
        for (let i = 0; i < programs.length; i++) {
            if (programs[i].uniqueId === needle.uniqueId) {
                programs[i] = invocation;
                return;
            }
            log("finding in", programs, i, needle.uniqueId);
            const found = this.recurseFindAndReplace(
                programs[i],
                needle,
                invocation
            );
            if (found) {
                return;
            }
        }
    }

    public recurseFindAndReplace(program: any, needle: any, invocation: Invocation) {
        if (program.args === undefined)  {
            return false;
        }
        log("Checking", program.args.map((i: any) => i.uniqueId), needle.uniqueId);
        for (let i = 0; i < program.args.length; i++) {
            if (program.args[i].uniqueId === needle.uniqueId) {
                log("Replacing", program, i, invocation);
                program.args[i] = invocation;
                return true;
            }
            this.recurseFindAndReplace(program.args[i], needle, invocation);
        }
        return false;
    }
}

export default App;

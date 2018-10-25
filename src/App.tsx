import autobind from "autobind-decorator";
import * as React from "react";
import "./App.css";
import Arg from "./Arg";
import CanSearch from "./CanSearch";
import Constant from "./Constant";
import Cork from "./Cork";
import Executor from "./Executor";
import InputConfiguration from "./InputConfiguration";
import InputConfigurator from "./InputConfigurator";
import Invocation from "./Invocation";
import KeyboardController from "./KeyboardController";
import Library from "./Library";
import Program from "./Program";
import Socket from "./Socket";

const CAPITALIZE_SENTENCE = new Invocation("join", [
    new Invocation("map", [
        new Invocation("split", [
            new Arg()
        ]),
        new Invocation("capitalize", [
            new Cork()
        ])
    ]),
    new Constant(" ")
]);

interface IState {
    highlightedLibraryItemId: string;
    canCursorId: string;
    inputs: InputConfiguration[];
    library: any;
    modules: any;
    currentModuleId: string;
    currentBrickId: string;
}
const log = console.log;

class App extends React.Component<{}, IState> {
    public componentDidMount() {
        const keyboardController = new KeyboardController(this);
        keyboardController.registerKeyEvents();

        this.setState({
            canCursorId: CAPITALIZE_SENTENCE.uniqueId,
            currentBrickId: "sentence_cap",
            currentModuleId: "basic",
            highlightedLibraryItemId: "string",
            inputs: [new InputConfiguration(0)],
            library: Library,
            modules: {
                basic: {
                    bricks: {
                        sentence_cap: CAPITALIZE_SENTENCE
                    },
                    name: "Starter Module"
                }
            }
        });
    }

    public render() {
        const highlight = this.highlightLibraryItem.bind(this);
        const onCanClick = this.onCanClick.bind(this);
        if (this.state === null) {
            return null;
        }
        const onSocketClick = this.onSocketClick.bind(this);
        return (
            <div className="App" style={{display: "flex"}}>
                <CanSearch library={Library} onLibraryItemHighlighted={highlight}/>
                <div>
                    <InputConfigurator inputs={this.state.inputs} onInputsChanged={this.onInputsChanged}/>
                    <Executor program={this.currentBrick()} library={this.state.library}/>
                    <Program
                        contents={this.currentBrick()}
                        library={this.state.library}
                        onSocketClick={onSocketClick}
                        onCanClick={onCanClick}
                        canCursorId={this.state.canCursorId}
                    />
                </div>
            </div>
        );
    }

    public currentBrick() {
        return this.state
            .modules[this.state.currentModuleId]
            .bricks[this.state.currentBrickId];
    }

    public highlightLibraryItem(libraryItemId: any) {
        this.setState({highlightedLibraryItemId: libraryItemId});
    }

    public invocationForHighlightedItem() {
        const itemId = this.state.highlightedLibraryItemId;
        const libraryItem = this.state.library[itemId];
        if (libraryItem.invocationGenerator) {
            return libraryItem.invocationGenerator();
        }
        const args = [];
        for (let i = 0; i < libraryItem.numArgs; i++) {
            args.push(new Socket());
        }
        return new Invocation(itemId, args);
    }

    public onSocketClick(clickedSocket: any) {
        const invocation = this.invocationForHighlightedItem();
        this.recurseFindAndReplace(
            this.currentBrick(),
            clickedSocket,
            invocation
        );
        this.setState({});
    }

    public onCanClick(clickedInvocation: any) {
        log("Clicked a can", clickedInvocation);
        this.recurseFindAndReplace(
            this.currentBrick(),
            clickedInvocation,
            new Socket()
        );
        this.setState({});
    }

    @autobind
    public onInputsChanged(inputs: InputConfiguration[]) {
        this.setState({ inputs });
    }

    public recurseFindAndReplace(program: any, needle: any, invocation: any) {
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

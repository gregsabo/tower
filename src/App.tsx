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
import * as Modules from "./Modules";
import Program from "./Program";
import Socket from "./Socket";

const CAPITALIZE_SENTENCE = Invocation.create({
    args: [
        Invocation.create({
            args: [
                Invocation.create({
                    args: [
                        new Arg()
                    ],
                    implementationKey: "split"
                }),
                Invocation.create({
                    args: [
                        new Cork()
                    ],
                    implementationKey: "capitalize"
                })
            ],
            implementationKey: "map"
        }),
        Constant.create({value: " "})
    ],
    implementationKey: "join"
});

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
        const modules = {
            basic: {
                bricks: {
                    sentence_cap: {
                        name: "Sentence Capitalization",
                        numArgs: 1,
                        rootInvocation: CAPITALIZE_SENTENCE
                    }
                },
                name: "Starter Module"
            }
        };
        Modules.importModulesIntoLibrary(modules, Library);
        log("Library is now", Library);

        this.setState({
            canCursorId: CAPITALIZE_SENTENCE.uniqueId,
            currentBrickId: "sentence_cap",
            currentModuleId: "basic",
            highlightedLibraryItemId: "string",
            inputs: [new InputConfiguration(0)],
            library: Library,
            modules
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
                <CanSearch library={Library} modules={this.state.modules} onLibraryItemHighlighted={highlight}/>
                <div>
                    <InputConfigurator inputs={this.state.inputs} onInputsChanged={this.onInputsChanged}/>
                    <Executor program={this.currentBrick()} library={this.state.library} modules={this.state.modules}/>
                    <Program
                        contents={this.currentBrick()}
                        library={this.state.library}
                        modules={this.state.modules}
                        onSocketClick={onSocketClick}
                        onBrickNameChange={this.onBrickNameChange}
                        onCanClick={onCanClick}
                        canCursorId={this.state.canCursorId}
                    />
                </div>
            </div>
        );
    }

    public currentBrick() {
        return Modules.getBrickFromModules(
            this.state.currentModuleId,
            this.state.currentBrickId,
            this.state.modules
        );
    }

    @autobind
    public onBrickNameChange(newName: string) {
        this.currentBrick().name = newName;
        this.setState({});
    }

    public highlightLibraryItem(libraryItemId: any) {
        this.setState({highlightedLibraryItemId: libraryItemId});
    }

    public invocationForHighlightedItem() {
        const itemId = this.state.highlightedLibraryItemId;
        const libraryItem = Modules.maybeLookUpModule(
            this.state.library[itemId], this.state.modules
        );

        if (libraryItem.invocationGenerator) {
            return libraryItem.invocationGenerator();
        }
        const args = [];
        for (let i = 0; i < libraryItem.numArgs; i++) {
            args.push(Socket.create({}));
        }
        return Invocation.create({
            args,
            implementationKey: itemId
        });
    }

    public onSocketClick(clickedSocket: any) {
        const invocation = this.invocationForHighlightedItem();
        if (this.currentBrick().rootInvocation === clickedSocket) {
            this.currentBrick().rootInvocation = invocation;
            this.setState({});
            return;
        }
        this.recurseFindAndReplace(
            this.currentBrick().rootInvocation,
            clickedSocket,
            invocation
        );
        this.setState({});
    }

    public onCanClick(clickedInvocation: any) {
        log("Clicked a can", clickedInvocation);
        if (this.currentBrick().rootInvocation === clickedInvocation) {
            this.currentBrick().rootInvocation = Socket.create({});
            this.setState({});
            return;
        }
        this.recurseFindAndReplace(
            this.currentBrick().rootInvocation,
            clickedInvocation,
            Socket.create({})
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

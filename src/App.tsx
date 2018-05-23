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

class App extends React.Component<{}, IState> {
  public componentDidMount() {
    this.setState({programs: PROGRAMS});
  }

  public render() {
    const highlight = this.highlightLibraryItem.bind(this);
    const appendProgram = this.appendProgram.bind(this);
    if (this.state === null) {
        return null;
    }
    return (
      <div style={{display: "flex"}}>
        <CanSearch library={Library} onLibraryItemHighlighted={highlight}/>
        <div>
            {this.state.programs.map((program: any, i: number) => {
                return <Program contents={program} key={i}/>;
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
    const log = console.log;
    log("Adding program");
    log(this.state.programs.concat([new Socket()]));
    this.setState({
      programs: this.state.programs.concat([new Socket()])
    });
  }
}

export default App;

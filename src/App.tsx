import * as React from "react";
import "./App.css";
import Can from "./Can";
import CanSearch from "./CanSearch";
import Invocation from "./Invocation";
import Library from "./Library";

const ARG = "ARG";

const PROGRAM = new Invocation(Library.join, [
    new Invocation(Library.map, [
        new Invocation(Library.split, [
            ARG
        ]),
        Library.capitalize
    ]),
    " "
]);

const style = {
    display: "flex"
};

interface IState {
    highlightedLibraryItem: any;
}

class App extends React.Component<{}, IState> {
  public render() {
    const highlight = this.highlightLibraryItem.bind(this);
    return (
      <div style={style}>
          <CanSearch library={Library} onLibraryItemHighlighted={highlight}/>
          <Can contents={PROGRAM}/>
      </div>
    );
  }

  public highlightLibraryItem(libraryItem: any) {
      this.setState({highlightedLibraryItem: libraryItem});
  }
}

export default App;

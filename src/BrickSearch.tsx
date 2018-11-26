import autobind from "autobind-decorator";
import * as React from "react";
import "./BrickSearch.css";
import * as Modules from "./Modules";
import {
  ILibrary,
  ILibraryBrick,
  ILibraryBrickWithImplementation,
  IModuleLibraryBrick,
  IModules,
  LibraryKey
} from "./Types";

interface IProps {
  library: ILibrary;
  modules: IModules;
  onLibraryItemSelected: (libraryKey: LibraryKey) => void;
}

interface IState {
  filter: string;
  selectedId: string;
}

function keyValues(inObject: object) {
  const outArray = [];
  for (const key in inObject) {
    if (inObject.hasOwnProperty(key)) {
      outArray.push([key, inObject[key]]);
    }
  }
  return outArray;
}

class BrickSearch extends React.Component<IProps, IState> {
  public inputBox = React.createRef<HTMLInputElement>();

  constructor(props: IProps) {
    super(props);
    this.state = { filter: "", selectedId: "" };
  }

  public render() {
    return (
      <div className="BrickSearch">
        <input
          type="text"
          ref={this.inputBox}
          placeholder="Search the Library"
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          autoFocus={true}
        />
        <div className="BrickSearch-library">{this.renderLibrary()}</div>
      </div>
    );
  }

  @autobind
  public onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newFilter = e.target.value;

    const selected = this.filteredLibrary(newFilter)[0];
    if (selected && selected.length > 0) {
      this.setState({
        selectedId: selected[0]
      });
    }
    this.setState({ filter: newFilter });
  }

  @autobind
  public onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && this.state.selectedId) {
      return this.props.onLibraryItemSelected(this.state.selectedId);
    }
  }

  public filteredLibrary(filter: string) {
    return keyValues(this.props.library).filter(
      ([_, value]: [LibraryKey, ILibraryBrick]) => {
        const name = this.lookupBrickName(value);
        return name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
      }
    );
  }

  public renderLibrary() {
    return this.filteredLibrary(this.state.filter).map(
      ([key, brick]: [LibraryKey, ILibraryBrick]) => {
        return this.renderLibraryItem(brick, key);
      }
    );
  }

  @autobind
  public renderLibraryItem(libraryItem: ILibraryBrick, key: LibraryKey) {
    let className = "";
    if (this.state && key === this.state.selectedId) {
      className = "BrickSearch-libraryItem--selected";
    }
    return (
      <div key={key} className={className}>
        {this.lookupBrickName(libraryItem)}
      </div>
    );
  }

  public lookupBrickName(item: ILibraryBrick) {
    const moduleItem = item as IModuleLibraryBrick;
    if (moduleItem.moduleKey && moduleItem.brickKey) {
      return Modules.getTowerFromModules(
        moduleItem.moduleKey,
        moduleItem.brickKey,
        this.props.modules
      ).name;
    } else {
      return (item as ILibraryBrickWithImplementation).name;
    }
  }
}

export { BrickSearch };

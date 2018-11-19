import autobind from "autobind-decorator";
import * as React from "react";
import "./BrickSearch.css";
import * as Modules from "./Modules";
import {ILibrary, IModules, LibraryKey} from "./Types";

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

    constructor(props: any){
        super(props);
        this.state = { filter: "", selectedId: "" };
    }

    public render() {
        return <div className="BrickSearch">
            <input
                type="text"
                ref={this.inputBox}
                placeholder="Search the Library"
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                autoFocus={true}
            />
            <div className="BrickSearch-library">
                {this.renderLibrary()}
            </div>
        </div>;
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
        this.setState({filter: newFilter});
    }

    @autobind
    public onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && this.state.selectedId) {
            return this.props.onLibraryItemSelected(this.state.selectedId);
        }
    }

    public filteredLibrary(filter: string) {
        return keyValues(this.props.library).filter(([_, value]: any) => {
            const name = this.maybeLookupModule(value).name;
            return name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        });
    }

    public renderLibrary() {
        return this.filteredLibrary(this.state.filter).map((keyval: any) => {
            return this.renderLibraryItem(keyval[1], keyval[0]);
        });
    }

    @autobind
    public renderLibraryItem(libraryItem: any, key: string) {
        let className = "";
        if (this.state && key === this.state.selectedId) {
            className = "BrickSearch-libraryItem--selected";
        }
        return <div key={key} className={className}>
            {this.maybeLookupModule(libraryItem).name}
        </div>;
    }

    public maybeLookupModule(item: any) {
        if (item.moduleKey && item.brickKey) {
            return Modules.getBrickFromModules(item.moduleKey, item.brickKey, this.props.modules);
        } else {
            return item;
        }
    }
}

export {BrickSearch};

import autobind from "autobind-decorator";
import * as React from "react";
import "./CanSearch.css";
import * as Modules from "./Modules";

interface IProps {
    library: any;
    modules: any;
    onLibraryItemSelected: any;
}

interface IState {
    filter: string;
    selectedId: string;
}

function keyValues(inObject: any) {
    const outArray = [];
    for (const key in inObject) {
        if (inObject.hasOwnProperty(key)) {
            outArray.push([key, inObject[key]]);
        }
    }
    return outArray;
}

class CanSearch extends React.Component<IProps, IState> {
    public inputBox: any;

    public render() {
        const onKeyUp = this.onKeyUp.bind(this);
        return <div className="CanSearch">
            <input
                type="text"
                ref={this.inputBox}
                placeholder="Search the Library"
                onKeyUp={onKeyUp}
                autoFocus={true}
            />
            <div className="CanSearch-library">
                {this.renderLibrary()}
            </div>
        </div>;
    }

    public onKeyUp(e: any) {
        const selected = this.filteredLibrary()[0];
        console.log("CanSeach sees", e.nativeEvent.code);
        // TODO: what's the right code here?
        if (e.nativeEvent.code === "Enter" && this.state.selectedId) {
            return this.props.onLibraryItemSelected(this.state.selectedId);
        }
        if (selected && selected.length > 0) {
            this.setState({
                filter: e.target.value,
                selectedId: selected[0]
            });
        } else {
            this.setState({ filter: e.target.value });
        }
    }

    public filteredLibrary() {
        if (this.state === null || this.state.filter === null) {
            return keyValues(this.props.library);
        }

        return keyValues(this.props.library).filter(([_, value]: any) => {
            const name = this.maybeLookupModule(value).name;
            return name.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1;
        });
    }

    public renderLibrary() {
        return this.filteredLibrary().map((keyval: any) => {
            return this.renderLibraryItem(keyval[1], keyval[0]);
        });
    }

    @autobind
    public renderLibraryItem(libraryItem: any, key: string) {
        let className = "";
        if (this.state && key === this.state.selectedId) {
            className = "CanSearch-libraryItem--selected";
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

export default CanSearch;

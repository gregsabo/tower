import autobind from "autobind-decorator";
import * as React from "react";
import "./CanSearch.css";

interface IProps {
    library: any;
    onLibraryItemHighlighted: any;
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
            <input type="text" ref={this.inputBox} placeholder="Search the Library" onKeyUp={onKeyUp}/>
            <div className="CanSearch-library">
                {this.renderLibrary()}
            </div>
        </div>;
    }

    public onKeyUp(e: any) {
        const selected = this.filteredLibrary()[0];
        this.setState({
            filter: e.target.value,
            selectedId: selected[0]
        });
        this.props.onLibraryItemHighlighted(selected[0], selected[1]);
    }

    public filteredLibrary() {
        if (this.state === null || this.state.filter === null) {
            return keyValues(this.props.library);
        }

        return keyValues(this.props.library).filter(([_, value]: any) => {
            return value.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1;
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
            {libraryItem.name}
        </div>;

    }
}

export default CanSearch;

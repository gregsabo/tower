import autobind from "autobind-decorator";
import * as React from "react";
import "./CanSearch.css";

interface IProps {
    library: any;
    onLibraryItemHighlighted: any;
}

interface IState {
    filter: string;
    selected: any;
}

function values(inObject: any) {
    const outArray = [];
    for (const key in inObject) {
        if (inObject.hasOwnProperty(key)) {
            outArray.push(inObject[key]);
        }
    }
    return outArray;
}

class CanSearch extends React.Component<IProps, IState> {
    public inputBox: any;

    public render() {
        const onKeyUp = this.onKeyUp.bind(this);
        return <div>
            <input type="text" ref={this.inputBox} placeholder="Search for a can" onKeyUp={onKeyUp}/>
            <div className="CanSearch-library">
                {this.filteredLibrary().map(this.renderLibraryItem.bind(this))}
            </div>
        </div>;
    }

    public onKeyUp(e: any) {
        const selected = this.filteredLibrary()[0];
        this.setState({
            filter: e.target.value,
            selected
        });
        this.props.onLibraryItemHighlighted(selected);
    }

    public filteredLibrary() {
        const libraryArray = values(this.props.library);
        if (this.state === null || this.state.filter === null) {
            return libraryArray;
        }
        return libraryArray.filter((value: any) => {
            return value.name.toLowerCase().indexOf(this.state.filter.toLowerCase()) > -1;
        });
    }

    @autobind
    public renderLibraryItem(libraryItem: any, index: number) {
        let className = "";
        if (this.state && libraryItem === this.state.selected) {
            className = "CanSearch-libraryItem--selected";
        }
        return <div key={libraryItem.name} className={className}>
            {libraryItem.name}
        </div>;

    }
}

export default CanSearch;

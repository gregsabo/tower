import * as React from "react";

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
                {this.filteredLibrary().map(this.renderLibraryItem)}
            </div>
        </div>;
    }

    public onKeyUp(e: any) {
        this.setState({filter: e.target.value});
        this.props.onLibraryItemHighlighted(this.filteredLibrary()[0]);
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

    public renderLibraryItem(libraryItem: any) {
        return <div key={libraryItem.name}>
            {libraryItem.name}
        </div>;

    }
}

export default CanSearch;

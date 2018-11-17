import autobind from "autobind-decorator";
import * as React from "react";
import * as Runtime from "./Runtime";
import Value from "./Value";
import {parseLiteral} from "./Parsing";
import "./TestGrid.css";

interface IProps {
    brick: any;
    onTestsChanged: any;
    library: any;
    modules: any;
}

export default class TestGrid extends React.Component<IProps> {
    private firstCell = null;

    public componentDidMount() {
        console.log("Testgrid mounted", this.firstCell);
        if (this.firstCell) {
            this.firstCell.focus();
        }
    }

    public render() {
        return <table>
            <thead>
                <tr>
                    <td>ARG 1</td><td>Expected Result</td><td>Actual Result</td>
                </tr>
            </thead>
            <tbody>
                {this.props.brick.tests.map(this.renderTest)}
                {this.renderEmptyTests()}
            </tbody>
        </table>
    }

    @autobind
    public renderTest(test, num) {
        let ref = null;
        if (num === 0) {
            ref = (first) => this.firstCell = first
        }
        const inputs = test.args;
        let result = null;
        if (inputs.length === this.props.brick.numArgs) {
            result = Runtime.evaluate(
                this.props.brick.rootInvocation,
                test.args,
                this.props.library,
                this.props.modules,
                {}
            );
        }
        return <tr>
            <td ref={ref} contentEditable={true} onInput={this.onArgChanged.bind(this, num, 0)}>
                {test.args[0]}
            </td>
            <td contentEditable={true} onInput={this.onExpectationChanged.bind(this, num)}>{test.expected}</td>
            <td>{result ? <Value value={result}/> : null}</td>
        </tr>
    }

    @autobind
    public onArgChanged(row, argnum, e) {
        const test = this.getTestNum(row);
        test.args[argnum] = parseLiteral(e.target.textContent);
        this.props.onTestsChanged(this.props.brick.tests);
    }

    @autobind
    public onExpectationChanged(row, e) {
        const test = this.getTestNum(row);
        test.expected = parseLiteral(e.target.textContent);
        this.props.onTestsChanged(this.props.brick.tests);
    }

    public getTestNum(num: number) {
        if (this.props.brick.tests === undefined) {
            this.props.brick.tests = [];
        }
        if (this.props.brick.tests[num] === undefined) {
            this.props.brick.tests[num] = this.newTest();
        }
        return this.props.brick.tests[num]
    }

    public newTest() {
        return {
            args: [],
            expeced: null
        };
    }

    public renderEmptyTests() {
        const tests = [];
        for (let i = this.props.brick.tests.length; i < 10; i++) {
            tests.push(this.renderTest({
                args: [],
                expected: null
            }, i));
        }
        return tests;
    }
}
import Socket from "./Socket";
import * as React from "react";

export default function Value(props) {
    const result = props.value;

    if (Socket.describes(result)) {
        return "<unfilled socket>";
    } else if (result instanceof Error) {
        return `Error: ${result.message}`;
    } else if (Array.isArray(result)) {
        return <table>
            <tr>
                {result.map((item, i) => <td key={i}><Value value={item}/></td>)}
            </tr>
        </table>
    } else {
        return result;
    }
}
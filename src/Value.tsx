import Socket from "./Socket";
import * as React from "react";
import { TowerPrimitive } from "./Types";

interface IProps {
  value: TowerPrimitive;
}

export default function Value(props: IProps) {
  const result = props.value;
  return <div>{renderResultString(result)}</div>;
}

function renderResultString(result: TowerPrimitive) {
  if (Socket.describes(result)) {
    return "<unfilled socket>";
  } else if (result instanceof Error) {
    return `Error: ${result.message}`;
  } else if (Array.isArray(result)) {
    return result.join(", ");
  } else if (typeof result === "string" && result.trim() === "") {
    return '"' + result + '"';
  } else {
    return result;
  }
}

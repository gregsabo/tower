import { Socket } from "./Socket";
import * as React from "react";
import { TowerPrimitive } from "./Types";
import { isBoolean } from "lodash";

interface IProps {
  value: TowerPrimitive;
}

export default function Value(props: IProps) {
  const result = props.value;
  return <div>{renderResultString(result)}</div>;
}

function renderResultString(result: TowerPrimitive) {
  if (result instanceof Socket) {
    return "<unfilled socket>";
  } else if (result instanceof Error) {
    return `Error: ${result.message}`;
  } else if (Array.isArray(result)) {
    return result.join(", ");
  } else if (typeof result === "string" && result.trim() === "") {
    return '"' + result + '"';
  } else if (isBoolean(result)) {
    return result.toString();
  } else {
    return result;
  }
}

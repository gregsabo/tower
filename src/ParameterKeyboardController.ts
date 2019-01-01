import App from "./App";
import { makeUniqueId } from "./MakeUniqueId";
import { ParameterEditingState, IInputConfiguration } from "./Types";
import { findIndex } from "lodash";

export function newParameter(app: App) {
  const key = makeUniqueId();
  app.currentTower().inputs.push({
    displayName: "",
    key
  });
  app.modulesChanged();
  app.setState({
    parameterEditingState: {
      mode: "naming",
      key
    }
  });
}

export function exitNamingMode(app: App) {
  app.setState({
    parameterEditingState: null
  });
}

export function isActive(app: App) {
  return app.state.editorMode === "parameter";
}

export function activate(app: App) {
  const currentParameters = app.currentTower().inputs;
  const parameterEditingState: ParameterEditingState =
    currentParameters.length === 0
      ? null
      : { mode: "cursor", key: currentParameters[0].key };
  return app.setState({
    editorMode: "parameter",
    parameterEditingState
  });
}

export function deactivate(app: App) {
  if (app.state.parameterEditingState) {
    app.state.parameterEditingState.mode = "cursor";
  }
  app.modulesChanged();
}

export function currentCursorIndex(app: App) {
  const currentKey = app.state.parameterEditingState
    ? app.state.parameterEditingState.key
    : null;
  return findIndex(app.currentTower().inputs, (input: IInputConfiguration) => {
    return input.key === currentKey;
  });
}

export function cursorUp(app: App) {
  if (app.state.parameterEditingState === null) {
    throw new Error("This should not happen.");
  }
  const foundIndex = currentCursorIndex(app);
  if (foundIndex === 0) {
    return;
  }
  app.state.parameterEditingState.key = app.currentTower().inputs[
    foundIndex - 1
  ].key;
  app.setState({});
}

export function cursorDown(app: App) {
  if (app.state.parameterEditingState === null) {
    throw new Error("This should not happen.");
  }
  const foundIndex = currentCursorIndex(app);
  if (foundIndex + 1 >= app.currentTower().inputs.length) {
    return;
  }
  app.state.parameterEditingState.key = app.currentTower().inputs[
    foundIndex + 1
  ].key;
  app.setState({});
}

export function dispatch(e: KeyboardEvent, app: App) {
  if (
    app.state.parameterEditingState &&
    app.state.parameterEditingState.mode === "naming"
  ) {
    if (e.code === "Enter") {
      return exitNamingMode(app);
    }
    return;
  }
  switch (e.code) {
    case "KeyI":
      e.preventDefault();
      return newParameter(app);
    case "KeyK":
      return cursorUp(app);
    case "KeyJ":
      return cursorDown(app);
  }
}

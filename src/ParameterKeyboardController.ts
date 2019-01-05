import App from "./App";
import { makeUniqueId } from "./MakeUniqueId";
import { IInputConfiguration } from "./Types";
import { findIndex } from "lodash";
import { Input } from "./Input";

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

export function renameParameter(app: App) {
  app.state.parameterEditingState.mode = "naming";
  app.setState({});
}

export function exitNamingMode(app: App) {
  const oldKey = app.state.parameterEditingState.key;
  app.state.parameterEditingState.mode = "cursor";
  app.setState({
    parameterEditingState: {
      mode: "cursor",
      key: oldKey
    }
  });
  app.modulesChanged();
}

export function isActive(app: App) {
  return app.state.editorMode === "parameter";
}

export function activate(app: App) {
  const key =
    app.currentTower().inputs.length > 0
      ? app.currentTower().inputs[0].key
      : "";
  return app.setState({
    editorMode: "parameter",
    parameterEditingState: {
      mode: "cursor",
      key
    }
  });
}

export function deactivate(app: App) {
  if (app.state.parameterEditingState) {
    app.state.parameterEditingState.mode = "cursor";
  }
  app.setState({});
}

export function currentCursorIndex(app: App) {
  const currentKey = app.state.parameterEditingState.key;
  return findIndex(app.currentTower().inputs, (input: IInputConfiguration) => {
    return input.key === currentKey;
  });
}

export function cursorUp(app: App) {
  const foundIndex = currentCursorIndex(app);
  const newIndex = foundIndex === null ? 0 : foundIndex - 1;
  if (newIndex < 0) {
    return;
  }
  app.state.parameterEditingState.key = app.currentTower().inputs[newIndex].key;
  app.setState({});
}

export function cursorDown(app: App) {
  const foundIndex = currentCursorIndex(app);
  const newIndex = foundIndex === null ? 0 : foundIndex + 1;
  if (newIndex >= app.currentTower().inputs.length) {
    return;
  }
  app.state.parameterEditingState.key = app.currentTower().inputs[newIndex].key;
  app.setState({});
}

export function moveParameterDown(app: App) {
  const foundIndex = currentCursorIndex(app);
  const inputs = app.currentTower().inputs;
  if (foundIndex === null || foundIndex >= inputs.length) {
    return;
  }
  const neighborIndex = foundIndex + 1;
  const swap = inputs[neighborIndex];
  inputs[neighborIndex] = inputs[foundIndex];
  inputs[foundIndex] = swap;
  app.modulesChanged();
}

export function moveParameterUp(app: App) {
  const foundIndex = currentCursorIndex(app);
  const inputs = app.currentTower().inputs;
  if (foundIndex === null || foundIndex === 0) {
    return;
  }
  const neighborIndex = foundIndex - 1;
  const swap = inputs[neighborIndex];
  inputs[neighborIndex] = inputs[foundIndex];
  inputs[foundIndex] = swap;
  app.modulesChanged();
}

export function insertParameterNumber(app: App, num: number) {
  const inputKey = app.currentTower().inputs[currentCursorIndex(app)].key;
  const cursor = app.state.canCursorId;
  app.insertBrickAtUniqueId(cursor, new Input({ inputKey }));
  return;
}

export function deleteParameter(app: App) {
  const foundIndex = currentCursorIndex(app);
  if (foundIndex === null) {
    return;
  }
  app.currentTower().inputs.splice(foundIndex, 1);
  app.modulesChanged();
  const newNumInputs = app.currentTower().inputs.length;
  if (newNumInputs === 0) {
    return;
  }
  const newIndex = foundIndex >= newNumInputs ? newNumInputs - 1 : foundIndex;
  app.state.parameterEditingState.key = app.currentTower().inputs[newIndex].key;
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
  if (e.keyCode >= 49 && e.keyCode <= 57) {
    return insertParameterNumber(app, e.keyCode - 48);
  }
  switch (e.code) {
    case "KeyI":
      e.preventDefault();
      return newParameter(app);
    case "KeyK":
      return cursorUp(app);
    case "KeyJ":
      return cursorDown(app);
    case "KeyM":
      return moveParameterUp(app);
    case "KeyN":
      return moveParameterDown(app);
    case "KeyD":
      return deleteParameter(app);
    case "KeyR":
      e.preventDefault();
      return renameParameter(app);
  }
}

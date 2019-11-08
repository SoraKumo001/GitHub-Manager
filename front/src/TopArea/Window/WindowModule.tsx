import { ReduxModule } from "@jswf/redux-module";
import { WindowState } from "@jswf/react";
export class WindowModule extends ReduxModule<{
  windowState: WindowState;
}> {
  static defaultState = { windowState: WindowState.HIDE };
  setWindowState(windowState: WindowState) {
    this.setState({ windowState });
  }
  getWindowState() {
    return this.getState("windowState")!;
  }
}

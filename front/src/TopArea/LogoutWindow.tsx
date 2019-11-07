import styled from "styled-components";
import React from "react";

import { useModule, ReduxModule } from "@jswf/redux-module";
import { CircleButton } from "../Parts/CircleButton";
import { GitHubModule } from "../GitHub/GitHubModule";
import { JSWindow, WindowState } from "@jswf/react";
import { githubConfig } from "../config";

const Logout = styled.div`
  display: flex;
  height: 100%;
  padding: 0.8em;
  box-sizing: border-box;
  flex-direction: column;

  > #message {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    > div {
      display: inline-block;
      color: #224488;
      font-weight: bold;
    }
  }
  #link {
    font-size: 60%;
  }
  > * {
    margin: 0.2em;
  }
`;

export class LogoutWindowModule extends ReduxModule<{
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

export function LogoutWindow() {
  const gitHubModule = useModule(GitHubModule);
  const logoutWindowModule = useModule(LogoutWindowModule);
  const windowState = logoutWindowModule.getWindowState();
  return (
    <>
      <JSWindow
        windowState={windowState}
        title="ログアウト"
        clientStyle={{ backgroundColor: "#aaeeff" }}
        onUpdate={e =>
          windowState !== e.windowState &&
          logoutWindowModule.setWindowState(e.windowState)
        }
      >
        <Logout>
          <div id="link">
            <a
              target="_blank"
              href={`https://github.com/settings/connections/applications/${githubConfig.clientId}`}
            >
              GitHubの権限設定
            </a>
          </div>
          <div id="link">
            <a target="_blank" href="https://github.com/logout">
              GitHubのログアウト
            </a>
          </div>
          <div id="message">
            <div>ログアウトしますか？</div>
          </div>

          <CircleButton
            onClick={() => {
              logoutWindowModule.setWindowState(WindowState.HIDE);
              gitHubModule.logout();
            }}
          >
            OK
          </CircleButton>
          <CircleButton
            onClick={() => logoutWindowModule.setWindowState(WindowState.HIDE)}
          >
            Cancel
          </CircleButton>
        </Logout>
      </JSWindow>
    </>
  );
}

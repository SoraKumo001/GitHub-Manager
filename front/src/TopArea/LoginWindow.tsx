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
  > * {
    margin: 0.2em;
  }
  #link {
    font-size: 60%;
  }
  #option {
    background-color: rgba(255, 255, 255, 0.3);
    padding: 0.3em;
  }
`;

export class LoginWindowModule extends ReduxModule<{
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

export function LoginWindow() {
  const gitHubModule = useModule(GitHubModule);
  const loginWindowModule = useModule(LoginWindowModule);
  const windowState = loginWindowModule.getWindowState();
  const scopes = new Set(gitHubModule.getScopes());

  return (
    <>
      <JSWindow
        width={400}
        windowState={windowState}
        title="ログイン"
        clientStyle={{ backgroundColor: "#aaeeff" }}
        onUpdate={e =>
          windowState !== e.windowState &&
          loginWindowModule.setWindowState(e.windowState)
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
            <div>ログインしますか？</div>
            <div id="option">
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={scopes.has("repo")}
                    onChange={e => {
                      e.target.checked
                        ? scopes.add("repo")
                        : scopes.delete("repo");
                      console.log(scopes);
                      gitHubModule.setScopes(Array.from(scopes));
                    }}
                  />
                  プライベートリポジトリにアクセス
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={scopes.has("read:org")}
                    onChange={e => {
                      e.target.checked
                        ? scopes.add("read:org")
                        : scopes.delete("read:org");
                      gitHubModule.setScopes(Array.from(scopes));
                    }}
                  />
                  組織のポジトリにアクセス
                </label>
              </div>
            </div>
          </div>

          <CircleButton
            onClick={() => {
              loginWindowModule.setWindowState(WindowState.HIDE);
              gitHubModule.login();
            }}
          >
            OK
          </CircleButton>
          <CircleButton
            onClick={() => loginWindowModule.setWindowState(WindowState.HIDE)}
          >
            Cancel
          </CircleButton>
        </Logout>
      </JSWindow>
    </>
  );
}

import React from "react";

import { useModule } from "@jswf/redux-module";
import { CircleButton } from "../../Parts/CircleButton";
import { GitHubModule } from "../../GitHub/GitHubModule";
import { JSWindow, WindowState } from "@jswf/react";
import { githubConfig } from "../../config";
import { WindowStyle } from "./WindowStyle";
import { WindowModule } from "./WindowModule";

export function LoginWindow() {
  const gitHubModule = useModule(GitHubModule);
  const windowModule = useModule(WindowModule, "Login");
  const windowState = windowModule.getWindowState();
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
          windowModule.setWindowState(e.windowState)
        }
      >
        <WindowStyle>
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
              windowModule.setWindowState(WindowState.HIDE);
              gitHubModule.login();
            }}
          >
            OK
          </CircleButton>
          <CircleButton
            onClick={() => windowModule.setWindowState(WindowState.HIDE)}
          >
            Cancel
          </CircleButton>
        </WindowStyle>
      </JSWindow>
    </>
  );
}

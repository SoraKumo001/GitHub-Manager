import React from "react";
import { useModule } from "@jswf/redux-module";
import { CircleButton } from "../../Parts/CircleButton";
import { GitHubModule } from "../../GitHub/GitHubModule";
import { JSWindow, WindowState } from "@jswf/react";
import { githubConfig } from "../../config";
import { WindowStyle } from "./WindowStyle";
import { WindowModule } from "./WindowModule";

export function LogoutWindow() {
  const gitHubModule = useModule(GitHubModule);
  const windowModule = useModule(WindowModule, "Logout");
  const windowState = windowModule.getWindowState();
  return (
    <>
      <JSWindow
        windowState={windowState}
        title="ログアウト"
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
            <div>ログアウトしますか？</div>
          </div>

          <CircleButton
            onClick={() => {
              windowModule.setWindowState(WindowState.HIDE);
              gitHubModule.logout();
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

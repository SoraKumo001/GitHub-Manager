import styled from "styled-components";
import React, { useState } from "react";

import { useModule } from "@jswf/redux-module";
import { CircleButton } from "../Parts/CircleButton";
import { GitHubModule } from "../GitHub/GitHubModule";
import { JSWindow, WindowState } from "@jswf/react";

const Root = styled.div`
  padding: 0.2em;
`;

const Logout = styled.div`
  display: flex;
  height: 100%;
  padding: 0.8em;
  box-sizing: border-box;
  flex-direction: column;
  > div:nth-child(1) {
    margin-left: auto;
  }
  > div:nth-child(2) {
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
`;

export function UserButton() {
  const gitHubModule = useModule(GitHubModule);
  const loginName = gitHubModule.getLoginName();
  const [logoutWindow, setLogoutWindow] = useState(WindowState.HIDE);
  return (
    <Root>
      <CircleButton
        onClick={() => {
          loginName
            ? setLogoutWindow(WindowState.NORMAL)
            : gitHubModule.login();
        }}
      >
        {loginName || "未ログイン"}
      </CircleButton>
      {
        <JSWindow
          windowState={logoutWindow}
          title="ログアウト"
          clientStyle={{ backgroundColor: "#aaeeff" }}
        >
          <Logout>
            <div>
              <a
                target="_blank"
                href="https://github.com/settings/connections/applications/e42ae6f30bcb112e785d"
              >
                GitHubの権限設定
              </a>
            </div>
            <div>
              <div>ログアウトしますか？</div>
            </div>

            <CircleButton
              onClick={() => {
                setLogoutWindow(WindowState.HIDE);
                gitHubModule.logout();
              }}
            >
              OK
            </CircleButton>
            <CircleButton onClick={() => setLogoutWindow(WindowState.HIDE)}>
              Cancel
            </CircleButton>
          </Logout>
        </JSWindow>
      }
    </Root>
  );
}

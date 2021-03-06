import React from "react";
import styled from "styled-components";
import { LogoutWindow } from "./Window/LogoutWindow";
import { WindowModule } from "./Window/WindowModule";
import { CircleButton } from "../Parts/CircleButton";
import { GitHubModule } from "../GitHub/GitHubModule";
import { useModule } from "@jswf/redux-module";
import { WindowState } from "@jswf/react";
import { LoginWindow } from "./Window/LoginWindow";

const Root = styled.div`
  z-index: 100;
  display: flex;
  padding: 0.5em;
  background-color: #aaffdd;
  > #title {
    flex: 1;
    font-size: 250%;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    font-weight: bolder;
    color: white;
    -webkit-text-stroke: 1px rgba(30, 80, 60, 0.6);
  }
  > #buttons {
    padding: 0.2em;
    > * {
      margin-left: 0.5em;
    }
  }
`;

export function TopArea() {
  const gitHubModule = useModule(GitHubModule);
  const loginWindowModule = useModule(WindowModule, "Login", true);
  const logoutWindowModule = useModule(WindowModule, "Logout", true);
  const loginName = gitHubModule.getLoginName();
  const title = "GitHub Manager";
  return (
    <Root>
      <div id="title">{title}</div>
      <div id="buttons">
        <CircleButton onClick={() => gitHubModule.getRepositories()}>
          更新
        </CircleButton>
        <CircleButton
          onClick={() => {
            loginName
              ? logoutWindowModule.setWindowState(WindowState.NORMAL)
              : loginWindowModule.setWindowState(WindowState.NORMAL);
          }}
        >
          {loginName || "未ログイン"}
        </CircleButton>
      </div>
      <LoginWindow />
      <LogoutWindow />
    </Root>
  );
}

import {
  ListView,
  ListHeaders,
  ListHeader,
  ListRow,
  ListItem
} from "@jswf/react";
import React, { useEffect, useRef } from "react";
import { GitHubModule, GitRepositories } from "../GitHub/GitHubModule";
import { useModule } from "@jswf/redux-module";
import { LoadingImage } from "../Parts/LodingImage";
import dateFormat from "dateformat";
import styled from "styled-components";

const Root = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  #name {
    > div:nth-child(2) {
      font-size: 60%;
    }
  }
  #org {
    font-size: 80%;
    white-space: normal;
  }
`;

export function RepositorieList() {
  const gitHubModule = useModule(GitHubModule);
  const repositories = gitHubModule.getState("repositories");
  const loginName = gitHubModule.getLoginName();
  const listView = useRef<ListView>(null);
  const loading = gitHubModule.isLoading();
  useEffect(() => {
    //リポジトリデータが無ければ要求
    if (!repositories || !repositories.length) gitHubModule.getRepositories();
  }, [loginName]);

  return (
    <Root>
      {loading && <LoadingImage />}
      <ListView
        ref={listView}
        onItemDoubleClick={index =>
          listView.current &&
          window.open(
            (listView.current!.getItemValue(index) as GitRepositories[0]).url,
            "_blank"
          )
        }
      >
        <ListHeaders>
          <ListHeader width={250}>Name</ListHeader>
          <ListHeader width={100}>Owner</ListHeader>
          <ListHeader>Private</ListHeader>
          <ListHeader width={100}>DefBlanch</ListHeader>
          <ListHeader type="number">Branches</ListHeader>
          <ListHeader type="number">Stars</ListHeader>
          <ListHeader type="number">Watchers</ListHeader>
          <ListHeader width={180}>Date</ListHeader>
          <ListHeader>Commit Message</ListHeader>
        </ListHeaders>
        {repositories &&
          repositories.map(e => (
            <ListRow key={e.id} value={e}>
              <ListItem value={e.name}>
                <div id="name">
                  <div>{e.name}</div>
                  <div>{e.description}</div>
                </div>
              </ListItem>
              <ListItem value={e.owner}>
                <div id="org">{e.owner}</div>
              </ListItem>
              <ListItem>{e.private && "*"}</ListItem>
              <ListItem>{(e.branche && e.branche.defaultName) || "-"}</ListItem>
              <ListItem>{(e.branche && e.branche.count) || 0}</ListItem>
              <ListItem>{e.stars}</ListItem>
              <ListItem>{e.watchers}</ListItem>
              <ListItem value={new Date(e.updatedAt).getTime()}>
                <div>
                  <div>
                    U:{dateFormat(new Date(e.updatedAt), "yyyy/mm/dd HH:mm")}
                  </div>
                  <div>
                    C:{dateFormat(new Date(e.createdAt), "yyyy/mm/dd HH:mm")}
                  </div>
                </div>
              </ListItem>
              <ListItem>{e.branche && e.branche.message}</ListItem>
            </ListRow>
          ))}
      </ListView>
    </Root>
  );
}

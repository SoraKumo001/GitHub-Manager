/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

export function RepositorieList() {
  const gitHubModule = useModule(GitHubModule);
  const repositories = gitHubModule.getState("repositories");
  const loginName = gitHubModule.getLoginName();
  const listView = useRef<ListView>(null);
  const loading = gitHubModule.isLoading();
  useEffect(() => {
    gitHubModule.getRepositories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginName]);

  return (
    <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
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
          <ListHeader width={200}>Name</ListHeader>
          <ListHeader>Private</ListHeader>
          <ListHeader width={150}>Org</ListHeader>
          <ListHeader width={100}>DefBlanch</ListHeader>
          <ListHeader type="number">Branches</ListHeader>
          <ListHeader type="number">Stars</ListHeader>
          <ListHeader width={180}>Created</ListHeader>
          <ListHeader width={180}>Updated</ListHeader>
          <ListHeader>Description</ListHeader>
        </ListHeaders>
        {repositories &&
          repositories.map(e => (
            <ListRow key={e.id} value={e}>
              <ListItem>{e.name}</ListItem>
              <ListItem>{e.private && "*"}</ListItem>
              <ListItem>{e.org}</ListItem>
              <ListItem>{e.branche.defaultName}</ListItem>
              <ListItem>{e.branche.count}</ListItem>
              <ListItem>{e.stars}</ListItem>
              <ListItem>{dateFormat(e.createdAt, "yyyy/mm/dd hh:mm")}</ListItem>
              <ListItem>{dateFormat(e.updatedAt, "yyyy/mm/dd hh:mm")}</ListItem>
              <ListItem>{e.description}</ListItem>
            </ListRow>
          ))}
      </ListView>
    </div>
  );
}

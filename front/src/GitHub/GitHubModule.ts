/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as firebase from "firebase/app";
import "firebase/auth";
import { ReduxModule } from "@jswf/redux-module";
import { Adapter } from "@jswf/adapter";
import { hasProperty } from "./hasProperty";
import {
  getRepositories,
  QLRepositoryResult,
  QLRepositories
} from "./GraphQL/getRepositories";
import { firebaseConfig } from "./Firebase/config";

export type GitRepositories = {
  id: string;
  name: string;
  url: string;
  org: string;
  stars: number;
  private: boolean;
  branche: {
    defaultName: string;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
  description: string;
}[];

firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GithubAuthProvider();
provider.addScope("repo");
provider.addScope("read:org");

interface GitUser {
  name: string;
  token: string;
}
interface State {
  gitUser?: GitUser;
  repositories?: GitRepositories;
  loading: boolean;
}

export class GitHubModule extends ReduxModule<State> {
  static defaultState: State = JSON.parse(
    localStorage.getItem("saveInfo") || '{"loading":false}'
  ) as State;
  public getLoginName() {
    return this.getState("gitUser", "name");
  }
  public login() {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(({ credential, additionalUserInfo }) => {
        if (additionalUserInfo && credential) {
          const name = additionalUserInfo.username;
          const token = (credential as firebase.auth.AuthCredential & {
            accessToken: string;
          }).accessToken;
          if (name && token) {
            const gitUser = { name, token };
            localStorage.setItem("saveInfo", JSON.stringify({ gitUser }));
            this.setState({ gitUser });
          }
        }
      });
  }
  public logout() {
    this.setState({ gitUser: undefined });
    localStorage.removeItem("saveInfo");
    firebase.auth().signOut();
  }
  public getInfo() {
    return this.sendGitHub(`query {
      viewer {
        login
      }
    }`);
  }
  public isLoading() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.getState("loading")!;
  }
  public getRepositories() {
    this.setState({ loading: true });
    return this.sendGitHub(getRepositories)
      .then(e => {
        if (hasProperty<QLRepositoryResult["data"]>(e, "data")) {
          const repositories: GitRepositories = [];
          const repPush = (name: string, node: QLRepositories["nodes"][0]) => {
            repositories.push({
              id: node.id,
              name: node.name,
              url: node.url,
              private: node.isPrivate,
              branche: {
                defaultName: node.defaultBranchRef
                  ? node.defaultBranchRef.name
                  : "",
                count: node.branches.totalCount
              },
              stars: node.stargazers.totalCount || 0,
              org: name,
              createdAt: new Date(node.createdAt),
              updatedAt: new Date(node.updatedAt),
              description: node.description
            });
          };
          e.data.viewer.repositories.nodes.forEach(node =>
            repPush(e.data.viewer.name, node)
          );
          e.data.viewer.organizations.nodes.forEach(org => {
            org.repositories.nodes.forEach(node => repPush(org.name, node));
          });
          this.setState(repositories, "repositories");
        } else this.setState({ repositories: [] });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }
  public sendGitHub(params: string | object) {
    const token = this.getState("gitUser", "token")! as string;
    return Adapter.sendJsonAsync(
      "https://api.github.com/graphql",
      {
        query:
          typeof params === "object"
            ? (params as { loc: { source: { body: string } } }).loc.source.body
            : params
      },
      { Authorization: `bearer ${token}` }
    ).catch(({ status }) => {
      if (status === 401) this.logout();
    });
  }
}

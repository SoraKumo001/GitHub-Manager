import * as firebase from "firebase";
import { ReduxModule } from "@jswf/redux-module";
import { Adapter } from "@jswf/adapter";
import { hasProperty } from "./hasProperty";

const getRepositories = `
{
  viewer {
    name:login
    repositories(first: 100) {
      ...rep
    }
    organizations(first: 100) {
      nodes {
        name
        repositories(first: 100) {
          ...rep
        }
      }
    }
  }
}

fragment rep on RepositoryConnection {
  nodes {
    id
    url
    name
    branches: refs(first: 1, refPrefix: "refs/heads/") {
      totalCount
    }
    stargazers{
      totalCount
    }
    createdAt
    updatedAt
    description
    defaultBranchRef {
      name
    }
  }
}

`;
type QLRepositories = {
  nodes: {
    name: string;
    url: string;
    branches: { totalCount: number };
    stargazers: { totalCount: number };
    defaultBranchRef: { name: string };
    createdAt: string;
    updatedAt: string;
    description: string;
  }[];
};
type QLRepositoryResult = {
  data: {
    viewer: {
      name: string;
      organizations: {
        nodes: { name: string; repositories: QLRepositories }[];
      };
      repositories: QLRepositories;
    };
  };
};
export type GitRepositories = {
  name: string;
  url: string;
  org: string;
  stars: number;
  branche: {
    defaultName: string;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
  description: string;
}[];

const config = {
  apiKey: "AIzaSyA35Sjku0IzTmZmaZP5y12jrtUZBmXbO9A",
  authDomain: "github-manager-e0d8d.firebaseapp.com"
};

firebase.initializeApp(config);
const provider = new firebase.auth.GithubAuthProvider();
provider.addScope("repo:status");
provider.addScope("read:org");

interface GitUser {
  name: string;
  token: string;
}
interface State {
  gitUser?: GitUser;
  repositories?: GitRepositories;
}

export class GitHubModule extends ReduxModule<State> {
  static defaultState: State = JSON.parse(
    localStorage.getItem("saveInfo") || "{}"
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
  public getRepositories() {
    return this.sendGitHub(getRepositories).then(e => {
      if (hasProperty<QLRepositoryResult["data"]>(e, "data")) {
        //e.data.viewer.repositories
        const repositories: GitRepositories = [];
        const repPush = (name: string, node: QLRepositories["nodes"][0]) => {
          repositories.push({
            name: node.name,
            url: node.url,
            branche: {
              defaultName: node.defaultBranchRef.name,
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
      } else this.setState(undefined, "repositories");
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
    ).then((e: unknown | { message: string }) => {
      hasProperty<string>(e, "message") &&
        e.message === "Bad credentials" &&
        this.logout();
      return e;
    });
  }
}

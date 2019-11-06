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

//リポジトリ情報の構造
export type GitRepositories = {
  id: string;
  name: string;
  url: string;
  owner: string;
  stars: number;
  watchers: number;
  private: boolean;
  branche: {
    defaultName: string;
    count: number;
    message: string;
  };
  createdAt: Date;
  updatedAt: Date;
  description: string;
}[];

//Firebaseの初期化と認証スコープの定義
firebase.initializeApp(firebaseConfig);
const provider = new firebase.auth.GithubAuthProvider();
["repo", "read:org"].forEach(scope => provider.addScope(scope));

/**
 *github認証情報
 *
 * @interface GitUser
 */
interface GitUser {
  name: string;
  token: string;
}
/**
 *Reduxのストア保存ステータス
 *
 * @interface State
 */
interface State {
  gitUser?: GitUser;
  repositories?: GitRepositories;
  loading: boolean;
}

/**
 *GitHubアクセス用Reduxモジュール
 *
 * @export
 * @class GitHubModule
 * @extends {ReduxModule<State>}
 */
export class GitHubModule extends ReduxModule<State> {
  //Storeの初期状態
  static defaultState: State = JSON.parse(
    localStorage.getItem("saveInfo") || '{"loading":false}'
  ) as State;

  /**
   *ユーザ名の取得
   *
   * @returns
   * @memberof GitHubModule
   */
  public getLoginName() {
    return this.getState("gitUser", "name");
  }
  /**
   *GitHubApiログイン処理
   *
   * @memberof GitHubModule
   */
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
  /**
   *GitHubAPIログアウト処理
   *
   * @memberof GitHubModule
   */
  public logout() {
    this.setState({ gitUser: undefined });
    localStorage.removeItem("saveInfo");
    firebase.auth().signOut();
  }
  /**
   *情報取得状況を返す
   *
   * @returns
   * @memberof GitHubModule
   */
  public isLoading() {
    return this.getState("loading")!;
  }
  /**
   *リポジトリの情報を返す
   *
   * @returns
   * @memberof GitHubModule
   */
  public getRepositories() {
    this.setState({ loading: true });
    return this.sendGitHub(getRepositories)
      .then(e => {
        if (hasProperty<QLRepositoryResult["data"]>(e, "data")) {
          const repositories: { [key: string]: GitRepositories[0] } = {};
          const repPush = (name: string, node: QLRepositories["nodes"][0]) => {
            repositories[node.id] = {
              id: node.id,
              name: node.name,
              url: node.url,
              private: node.isPrivate,
              branche: {
                defaultName: node.defaultBranchRef
                  ? node.defaultBranchRef.name
                  : "",
                count: node.branches.totalCount,
                message: node.defaultBranchRef.target.message || ""
              },
              stars: node.stargazers.totalCount || 0,
              watchers: node.watchers.totalCount || 0,
              owner: node.owner.login,
              createdAt: new Date(node.createdAt),
              updatedAt: new Date(node.updatedAt),
              description: node.description
            };
          };
          e.data.viewer.repositories.nodes.forEach(node =>
            repPush(e.data.viewer.name, node)
          );
          e.data.viewer.organizations.nodes.forEach(org => {
            org &&
              org.repositories.nodes.forEach(node => repPush(org.name, node));
          });
          const rep = Object.values(repositories).sort((a, b) => {
            return b.updatedAt.getTime() - a.updatedAt.getTime();
          });
          this.setState(rep, "repositories");
        } else this.setState({ repositories: [] });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  /**
   *GitHubAPIに情報を要求する
   *
   * @param {(string | object)} params
   * @returns
   * @memberof GitHubModule
   */
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

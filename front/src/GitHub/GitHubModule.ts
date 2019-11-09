import { ReduxModule } from "@jswf/redux-module";
import { Adapter } from "@jswf/adapter";
import { hasProperty } from "hasproperty-ts";
import {
  getRepositories,
  QLRepositoryResult,
  QLRepositories,
  getRepositoriesOrg
} from "./GraphQLgetRepositories";
import { FirebaseGitAuthModule } from "./FirebaseGitAuthModule";

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
    count: number;
    name: string;
    message: string;
    update: string;
  };
  createdAt: string;
  updatedAt: string;
  description: string;
}[];

/**
 *Reduxのストア保存ステータス
 *
 * @interface State
 */
interface State {
  repositories?: GitRepositories;
  loading: boolean;
  scopes: string[];
}

/**
 *GitHubアクセス用Reduxモジュール
 *
 * @export
 * @class GitHubModule
 * @extends {ReduxModule<State>}
 */
export class GitHubModule extends ReduxModule<State> {
  static includes = [FirebaseGitAuthModule];
  //Storeの初期状態
  static defaultState: State = { loading: false, scopes: [] };

  /**
   *ユーザ名の取得
   *
   * @returns
   * @memberof GitHubModule
   */
  public getLoginName() {
    const firebaseModule = this.getModule(FirebaseGitAuthModule);
    return firebaseModule.getUserName();
  }
  public setScopes(scopes: string[]) {
    this.setState({ scopes });
  }
  public getScopes() {
    return this.getState("scopes")!;
  }
  public isScope(scope: string) {
    return this.getState("scopes")!.indexOf(scope) >= 0;
  }
  /**
   *GitHubApiログイン処理
   *
   * @memberof GitHubModule
   */
  public login() {
    const firebaseModule = this.getModule(FirebaseGitAuthModule);
    firebaseModule.login(this.getState("scopes")!);
  }
  /**
   *GitHubAPIログアウト処理
   *
   * @memberof GitHubModule
   */
  public logout() {
    const firebaseModule = this.getModule(FirebaseGitAuthModule);
    firebaseModule.logout();
    this.setState({ repositories: [] });
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
    return this.sendGitHub(
      this.isScope("read:org") ? getRepositoriesOrg : getRepositories
    )
      .then(e => {
        if (hasProperty<QLRepositoryResult["data"]>(e, "data")) {
          const repositories: { [key: string]: GitRepositories[0] } = {};

          const repPush = (_name: string, node: QLRepositories["nodes"][0]) => {
            const branche = node.branches
              ? node.branches.nodes.sort(
                  (a, b) =>
                    new Date(b.target.committedDate).getTime() -
                    new Date(a.target.committedDate).getTime()
                )[0]
              : undefined;
            repositories[node.id] = {
              id: node.id,
              name: node.name,
              url: node.url,
              private: node.isPrivate,
              branche: {
                count: node.branches ? node.branches.totalCount : 0,
                name: branche ? branche.name : "",
                message: branche ? branche.target.message : "",
                update: branche ? branche.target.committedDate : ""
              },
              stars: node.stargazers.totalCount || 0,
              watchers: node.watchers.totalCount || 0,
              owner: node.owner.login,
              createdAt: node.createdAt,
              updatedAt: node.updatedAt,
              description: node.description
            };
          };
          e.data.viewer.repositories.nodes.forEach(node =>
            repPush(e.data.viewer.name, node)
          );
          e.data.viewer.organizations &&
            e.data.viewer.organizations.nodes.forEach(org => {
              org &&
                org.repositories.nodes.forEach(node => repPush(org.name, node));
            });
          const rep = Object.values(repositories).sort((a, b) => {
            const av = a.branche.update
              ? new Date(a.branche.update).getTime()
              : 0;
            const bv = b.branche.update
              ? new Date(b.branche.update).getTime()
              : 0;
            return bv - av;
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
  public async sendGitHub(params: string | object) {
    const firebaseModule = this.getModule(FirebaseGitAuthModule);
    const token = firebaseModule.getToken();
    if (token) {
      return Adapter.sendJsonAsync(
        "https://api.github.com/graphql",
        {
          query:
            typeof params === "object"
              ? (params as { loc: { source: { body: string } } }).loc.source
                  .body
              : params
        },
        { Authorization: `bearer ${token}` }
      ).catch(({ status }) => {
        if (status === 401) this.logout();
      });
    }
    return null;
  }
}

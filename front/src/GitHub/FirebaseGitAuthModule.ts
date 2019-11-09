import { ReduxModule } from "@jswf/redux-module";
import * as firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from "../config";

/**
 *保存ステータス
 *
 * @interface State
 * name GitHubユーザ名
 * token GitHubAPIアクセストークン
 */
interface State {
  name: string | null;
  token: string | null;
}

/**
 *Firebase用GitHub認証モジュール
 *
 * @export
 * @class FBGitAuthModule
 * @extends {ReduxModule<State>}
 */
export class FirebaseGitAuthModule extends ReduxModule<State> {
  static defaultState: State = { name: null, token: null };
  static app?: firebase.app.App;
  /**
   *GitHubApiログイン処理
   *
   * @memberof FBGitAuthModule
   */
  public login(scopes: string[]) {
    //Firebaseの初期化
    if (!FirebaseGitAuthModule.app)
      FirebaseGitAuthModule.app = firebase.initializeApp(firebaseConfig);
    //認証スコープの定義
    const provider = new firebase.auth.GithubAuthProvider();
    scopes.forEach(scope => provider.addScope(scope));
    //Firebase経由のGitHubへの認証
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
            if (
              this.getState("name") !== name &&
              this.getState("token") !== token
            )
              this.setState({ name, token });
          }
        }
      });
  }
  /**
   *GitHubAPIログアウト処理
   *
   * @memberof FBGitAuthModule
   */
  public logout() {
    this.setState({ name: null, token: null });
    if (FirebaseGitAuthModule.app) firebase.auth().signOut();
  }
  /**
   *GitHubアクセス用トークンの取得
   *
   * @returns
   * @memberof FirebaseGitAuthModule
   */
  public getToken() {
    return this.getState("token");
  }
  /**
   *GitHubユーザ名の取得
   *
   * @returns
   * @memberof FirebaseGitAuthModule
   */
  public getUserName() {
    return this.getState("name");
  }
}

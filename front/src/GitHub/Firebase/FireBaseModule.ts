import { ReduxModule } from "@jswf/redux-module";
import * as firebase from "firebase/app";
import "firebase/auth";
import { firebaseConfig } from "../../config";
import undefined = require("firebase/auth");

/**
 *保存ステータス
 *
 * @interface State
 */
interface State {
  name: string | null;
  token: string | null;
}

//Firebaseの初期化
firebase.initializeApp(firebaseConfig);

/**
 *Firebase用GitHub認証モジュール
 *
 * @export
 * @class FBGitAuthModule
 * @extends {ReduxModule<State>}
 */
export class FBGitAuthModule extends ReduxModule<State> {
  static defaultState: State = { name: null, token: null };
  /**
   *GitHubApiログイン処理
   *
   * @memberof FBGitAuthModule
   */
  public login(scopes: string[]) {
    //認証スコープの定義
    const provider = new firebase.auth.GithubAuthProvider();
    scopes.forEach(scope => provider.addScope(scope));

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
    firebase.auth().signOut();
  }
  public getToken() {
    return this.getState("token");
  }
  public getUserName() {
    return this.getState("name");
  }
}

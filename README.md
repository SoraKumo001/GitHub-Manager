# GitHub Manager

## 概要

GitHub GraphQL API v4 の練習用プログラム

## リンク

- [動作サンプル](https://sorakumo001.github.io/GitHub-Manager/dist/)
- [ソースコード](https://github.com/SoraKumo001/GitHub-Manager)

## 動作画面

![https://raw.githubusercontent.com/SoraKumo001/GitHub-Manager/screencap/cap.png](https://raw.githubusercontent.com/SoraKumo001/GitHub-Manager/screencap/cap.png)

## ソースコードの構造

```txt
.
├── README.md
├── dist [出力ディレクトリ]
│   ├── index.html
│   └── js
│       ├── bundle.js
│       └── bundle.js.map
├── front
│   ├── public
│   │   └── index.html [トップページ定義]
│   ├── src
│   │   ├── App.tsx [Application初期設定]
│   │   ├── GitHub
│   │   │   ├── FirebaseGitAuthModule.ts  [FirebaseGit認証用モジュール]
│   │   │   ├── GitHubModule.ts           [Githubアクセス用モジュール]
│   │   │   └── GraphQLgetRepositories.ts [GraphQLクエリ]
│   │   ├── Parts [サブパーツコンポーネント]
│   │   │   ├── CircleButton [ボタンコンポーネント]
│   │   │   │   └── index.tsx
│   │   │   ├── FlexParent.tsx [配置スタイル定義用]
│   │   │   └── LodingImage [ローディングアニメーション]
│   │   │       ├── index.tsx
│   │   │       └── loading.svg
│   │   ├── RepositorieList [リポジトリリスト表示用]
│   │   │   └── RepositorieList.tsx
│   │   ├── TopArea [トップエリア]
│   │   │   ├── TopArea.tsx
│   │   │   └── Window [ログイン/ログアウトウインドウ]
│   │   │       ├── LoginWindow.tsx
│   │   │       ├── LogoutWindow.tsx
│   │   │       ├── WindowModule.tsx
│   │   │       └── WindowStyle.tsx
│   │   ├── config.ts [GitHub/FirebaseのAPIキー]
│   │   ├── index.tsx  [Store設定等]
│   │   ├── resource.d.ts [画像リソース定義用]
│   │   └── tsconfig.json
│   └── webpack.config.js
└── package.json
```

## 自分のサイトで使用する場合

FirebaseとGitHubにそれぞれ設定が必要となります

### Firebaseで認証用プロジェクトの作成

- [https://console.firebase.google.com/](https://console.firebase.google.com/)でプロジェクトを一つ作成します
- Authentication -> ログイン方法 -> GitHubを有効にする
- **認証コールバックURL**を取得(ClientIDとClientSecretは後で記入)

### GitHubにアプリケーションを登録

- [https://github.com/settings/developers](https://github.com/settings/developers)でアプリケーションを作成
- アプリケーション名と**認証コールバックURLを設定**(HomepageURLは正確でなくとも良い)
- 発行されたClientIDとClientSecretをFirebase側に設定

### アプリケーション上で必要となるデータ

config.tsファイルに以下の情報を設定します

- Firebase -> APIキー、AuthDomain
- GitHub   -> clientId

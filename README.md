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
│   │   ├── config.tsx [GitHub/FirebaseのAPIキー]
│   │   ├── index.tsx  [Store設定等]
│   │   ├── resource.d.ts [画像リソース定義用]
│   │   └── tsconfig.json
│   └── webpack.config.js
└── package.json
```

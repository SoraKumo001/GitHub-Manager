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
[ファイル構造]
│  package.json
│  README.md
├─dist [出力ディレクトリ]
│  │  index.html
│  └─js
│     bundle.js
│     bundle.js.map
└─front
    │  webpack.config.js
    ├─public
    │      index.html
    └─src
        │  .eslintrc.json
        │  config.ts [FirebaseのAPIキー]
        │  index.tsx [Reduxの初期設定等]
        |  App.tsx   [Application初期設定]
        │  resource.d.ts
        │  tsconfig.json
        ├─GitHub
        │  │  GitHubModule.ts
        │  ├─Firebase
        │  │      FireBaseModule.ts [Firebase]
        │  └─GraphQL
        │         getRepositories.ts [GraphQLクエリ]
        ├─Parts
        │  │  FlexParent.tsx
        │  │
        │  ├─CircleButton
        │  │      index.tsx
        │  └─LodingImage
        │          index.tsx
        │          loading.svg
        ├─RepositorieList
        │      RepositorieList.tsx
        └─TopArea
                LogoutWindow.tsx
                TopArea.tsx
```

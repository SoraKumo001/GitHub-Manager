# GitHub Manager

GitHub GraphQL API v4 の練習用プログラム

- [動作サンプル](https://sorakumo001.github.io/GitHub-Manager/dist/)
- [ソースコード](https://github.com/SoraKumo001/GitHub-Manager)

```txt
[ファイル構造]
│  package.json
│  README.md
├─dist [出力ディレクトリ]
│  │  index.html
│  └─js
│          bundle.js
│          bundle.js.map
└─front
    │  webpack.config.js
    ├─public
    │      index.html
    └─src
        │  .eslintrc.json
        │  index.tsx
        │  resource.d.ts
        │  tsconfig.json
        ├─GitHub
        │  │  GitHubModule.ts
        │  │  hasProperty.ts
        │  ├─Firebase
        │  │      config.ts [FirebaseのAPIキー]
        │  └─GraphQL
        │          getRepositories.ts [GraphQLクエリ]
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

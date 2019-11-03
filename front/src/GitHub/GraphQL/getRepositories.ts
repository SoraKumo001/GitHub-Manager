/// GraphQLアクセス用クエリーデータ
export const getRepositories = `
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
    isPrivate
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

/// クエリー結果の構造
export type QLRepositories = {
  nodes: {
    id: string;
    name: string;
    url: string;
    isPrivate: boolean;
    branches: { totalCount: number };
    stargazers: { totalCount: number };
    defaultBranchRef: { name: string };
    createdAt: string;
    updatedAt: string;
    description: string;
  }[];
};
export type QLRepositoryResult = {
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

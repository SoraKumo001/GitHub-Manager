/// GraphQLアクセス用クエリーデータ
export const getRepositories = `
{
  viewer {
    name: login
    repositories(last: 100) {
      ...rep
    }
    organizations(last: 100) {
      nodes {
        name
        repositories(last: 100) {
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
    owner{
      login
    }
    branches: refs(first: 1, refPrefix: "refs/heads/") {
      totalCount
    }
    stargazers {
      totalCount
    }
    watchers {
      totalCount
    }
    isPrivate
    createdAt
    updatedAt
    description
    defaultBranchRef {
      name
      target {
        ... on Commit {
          message
        }
      }
    }
  }
}

`;

/// クエリー結果の構造
export type QLRepositories = {
  nodes: {
    id: string;
    name: string;
    owner: { login: string };
    url: string;
    isPrivate: boolean;
    branches: { totalCount: number };
    watchers: { totalCount: number };
    stargazers: { totalCount: number };
    defaultBranchRef: { name: string; target: { message: string } };
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
        nodes: ({ name: string; repositories: QLRepositories } | null)[];
      };
      repositories: QLRepositories;
    };
  };
};

/// GraphQLアクセス用クエリーデータ
export const getRepositories = `
{
  viewer {
    name: login
    repositories(first: 100) {
      ...rep
    }
}

fragment rep on RepositoryConnection {
  nodes {
    id
    url
    name
    owner {
      login
    }
    branches: refs(last: 10, refPrefix: "refs/heads/") {
      totalCount
      nodes {
        name
        target {
          ... on Commit {
            committedDate
            message
          }
        }
      }
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
  }
}
`;
export const getRepositoriesOrg = `
{
  viewer {
    name: login
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
    owner {
      login
    }
    branches: refs(last: 10, refPrefix: "refs/heads/") {
      totalCount
      nodes {
        name
        target {
          ... on Commit {
            committedDate
            message
          }
        }
      }
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
    branches?: {
      totalCount: number;
      nodes: {
        name: string;
        target: { committedDate: string; message: string };
      }[];
    };
    watchers: { totalCount: number };
    stargazers: { totalCount: number };
    createdAt: string;
    updatedAt: string;
    description: string;
  }[];
};
export type QLRepositoryResult = {
  data: {
    viewer: {
      name: string;
      organizations?: {
        nodes: ({ name: string; repositories: QLRepositories } | null)[];
      };
      repositories: QLRepositories;
    };
  };
};

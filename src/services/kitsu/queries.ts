export const defaultEpisodesFields = `
number
titles {
  canonical
  alternatives
  localized
}
description
thumbnail {
  original {
    url
  }
}
`;

export const episodesQuery = (fields = defaultEpisodesFields) => `
query lookupMapping($externalId: ID!, $externalSite: MappingExternalSiteEnum!) {
  lookupMapping(externalId: $externalId, externalSite: $externalSite) {
    __typename
    ... on Anime {
      id
      episodes(first: 2000) {
        nodes {
          ${fields}
        }
      }
    }
  }
}
`;

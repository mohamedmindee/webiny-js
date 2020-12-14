export const DATA_FIELD = /* GraphQL */ `
    {
        id
        editor
        category {
            slug
        }
        version
        title
        url
        fullUrl
        content
        savedOn
        status
        locked
        publishedOn
        error
        notFound
        locked
        revisions {
            id
            status
            locked
            version
        }
        settings {
            general {
                snippet
                tags
                layout
                image {
                    id
                    src
                }
            }
            social {
                meta {
                    property
                    content
                }
                title
                description
                image {
                    id
                    src
                }
            }
            seo {
                title
                description
                meta {
                    name
                    content
                }
            }
        }
        createdFrom
        createdOn
        createdBy {
            id
            displayName
        }
    }
`;

const LIST_DATA_FIELD = /* GraphQL */ `
    {
        id
        editor
        category {
            slug
        }
        status
        title
        snippet
        tags
        images {
            general {
                id
                src
            }
        }
        url
        fullUrl
        status
        locked
        publishedOn
        savedOn
        createdFrom
        createdOn
        createdBy {
            id
            displayName
        }
    }
`;

export const ERROR_FIELD = /* GraphQL */ `
    {
        code
        data
        message
    }
`;

export const CREATE_PAGE = /* GraphQL */ `
    mutation CreatePage($from: ID, $category: String) {
        pageBuilder {
            createPage(from: $from, category: $category) {
                data ${DATA_FIELD}
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const UPDATE_PAGE = /* GraphQL */ `
    mutation UpdatePage($id: ID!, $data: PbUpdatePageInput!) {
        pageBuilder {
            updatePage(id: $id, data: $data) {
                data ${DATA_FIELD}
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const PUBLISH_PAGE = /* GraphQL */ `
    mutation PublishPage($id: ID!) {
        pageBuilder {
            publishPage(id: $id) {
                data ${DATA_FIELD}
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const UNPUBLISH_PAGE = /* GraphQL */ `
    mutation UnpublishPage($id: ID!) {
        pageBuilder {
            unpublishPage(id: $id) {
                data ${DATA_FIELD}
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const REQUEST_REVIEW = /* GraphQL */ `
    mutation RequestReview($id: ID!) {
        pageBuilder {
            requestReview(id: $id) {
                data ${DATA_FIELD}
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const REQUEST_CHANGES = /* GraphQL */ `
    mutation RequestChanges($id: ID!) {
        pageBuilder {
            requestChanges(id: $id) {
                data ${DATA_FIELD}
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const OEMBED_DATA = /* GraphQL */ `
    query GetOEmbedData($url: String!, $width: String, $height: String) {
        pageBuilder {
            oembedData(url: $url, width: $width, height: $height) {
                data
                error {
                    code
                    message
                }
            }
        }
    }
`;

export const LIST_PAGES = /* GraphQL */ `
    query ListPages($where: PbListPagesWhereInput, $limit: Int, $page: Int, $sort: PbListPagesSortInput, $search: PbListPagesSearchInput) {
        pageBuilder {
            listPages(where: $where, limit: $limit, page: $page, sort: $sort, search: $search) {
                data ${LIST_DATA_FIELD}
                meta {
                    page
                    limit
                    totalCount
                    totalPages
                    from
                    to
                    nextPage
                    previousPage
                }
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const LIST_PUBLISHED_PAGES = /* GraphQL */ `
    query ListPublishedPages($where: PbListPublishedPagesWhereInput, $limit: Int, $page: Int, $sort: PbListPagesSortInput) {
        pageBuilder {
            listPublishedPages(where: $where, limit: $limit, page: $page, sort: $sort) {
                data ${LIST_DATA_FIELD}
                error ${ERROR_FIELD}
                meta {
                    page
                    limit
                    totalCount
                    totalPages
                    from
                    to
                    nextPage
                    previousPage
                }
            }
        }
    }
`;

export const LIST_PAGE_TAGS = /* GraphQL */ `
    query ListPageTags($search: PbListPageTagsSearchInput!) {
        pageBuilder {
            listPageTags(search: $search) {
                data
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const GET_PAGE = /* GraphQL */ `
    query GetPage($id: ID!) {
        pageBuilder {
            getPage(id: $id) {
                data ${DATA_FIELD}
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const GET_PUBLISHED_PAGE = /* GraphQL */ `
    query GetPublishedPage($id: ID, $url: String) {
        pageBuilder {
            getPublishedPage(id: $id, url: $url) {
                data ${DATA_FIELD}
                error ${ERROR_FIELD}
            }
        }
    }
`;

export const DELETE_PAGE = /* GraphQL */ `
    mutation DeletePage($id: ID!) {
        pageBuilder {
            deletePage(id: $id) {
                data {
                    page ${DATA_FIELD}
                    latestPage ${DATA_FIELD}
                }
                error ${ERROR_FIELD}
            }
        }
    }
`;

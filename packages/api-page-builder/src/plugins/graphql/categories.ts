import { hasPermission, NotAuthorizedResponse } from "@webiny/api-security";
import { hasContentLocalePermission } from "@webiny/api-security-content";
import { pipe, Response, NotFoundResponse } from "@webiny/graphql";

const hasRwd = ({ pbCategoryPermission, rwd }) => {
    if (typeof pbCategoryPermission.rwd !== "string") {
        return true;
    }

    return pbCategoryPermission.rwd.includes(rwd);
};

export default {
    typeDefs: /* GraphQL */ `
        type PbCategoryCreatedBy {
            id: ID
            displayName: String
        }

        type PbCategory {
            id: ID
            createdOn: DateTime
            createdBy: PbCategoryCreatedBy
            name: String
            slug: String
            url: String
            layout: JSON
        }

        input PbCategoryInput {
            id: ID
            name: String
            slug: String
            url: String
            layout: JSON
        }

        # Response types
        type PbCategoryResponse {
            data: PbCategory
            error: PbError
        }

        type PbCategoryListResponse {
            data: [PbCategory]
            meta: PbListMeta
            error: PbError
        }

        extend type PbQuery {
            getCategory(slug: String!): PbCategoryResponse
            listCategories: PbCategoryListResponse

            "Returns category by given slug."
            getCategoryBySlug(slug: String!): PbCategoryResponse
        }

        extend type PbMutation {
            createCategory(data: PbCategoryInput!): PbCategoryResponse
            updateCategory(slug: String!, data: PbCategoryInput!): PbCategoryResponse
            deleteCategory(slug: String!): PbCategoryResponse
        }
    `,
    resolvers: {
        PbQuery: {
            getCategory: pipe(
                pipe(hasPermission("pb.category"), hasContentLocalePermission()),
                hasContentLocalePermission()
            )(async (_, args, context) => {
                // If permission has "rwd" property set, but "r" is not part of it, bail.
                const pbCategoryPermission = await context.security.getPermission("pb.category");
                if (pbCategoryPermission && !hasRwd({ pbCategoryPermission, rwd: "r" })) {
                    return new NotAuthorizedResponse();
                }

                const { categories } = context;
                const category = await categories.get(args.slug);
                if (!category) {
                    return new NotFoundResponse(`Category "${args.slug}" not found.`);
                }

                // If user can only manage own records, let's check if he owns the loaded one.
                if (pbCategoryPermission?.own === true) {
                    const identity = context.security.getIdentity();
                    if (category.createdBy.id !== identity.id) {
                        return new NotAuthorizedResponse();
                    }
                }

                return new Response(category);
            }),
            listCategories: pipe(
                hasPermission("pb.category"),
                hasContentLocalePermission()
            )(async (_, args, context) => {
                // If permission has "rwd" property set, but "r" is not part of it, bail.
                const pbCategoryPermission = await context.security.getPermission("pb.category");
                if (pbCategoryPermission && !hasRwd({ pbCategoryPermission, rwd: "r" })) {
                    return new NotAuthorizedResponse();
                }

                const { categories } = context;

                let list = await categories.list();

                // If user can only manage own records, let's check if he owns the loaded one.
                if (pbCategoryPermission?.own === true) {
                    const identity = context.security.getIdentity();
                    list = list.filter(category => category.createdBy.id === identity.id);
                }

                return new Response(list);
            })
        },
        PbMutation: {
            createCategory: pipe(
                hasPermission("pb.category"),
                hasContentLocalePermission()
            )(async (_, args, context) => {
                // If permission has "rwd" property set, but "w" is not part of it, bail.
                const pbCategoryPermission = await context.security.getPermission("pb.category");
                if (pbCategoryPermission && !hasRwd({ pbCategoryPermission, rwd: "w" })) {
                    return new NotAuthorizedResponse();
                }

                const { categories } = context;
                const { data } = args;

                if (await categories.get(data.slug)) {
                    return new NotFoundResponse(
                        `Category with slug "${data.slug}" already exists.`
                    );
                }

                const identity = context.security.getIdentity();

                const newData = {
                    ...data,
                    createdOn: new Date().toISOString(),
                    createdBy: {
                        id: identity.id,
                        displayName: identity.displayName
                    }
                };

                await categories.create(newData);

                return new Response(newData);
            }),
            updateCategory: pipe(
                hasPermission("pb.category"),
                hasContentLocalePermission()
            )(async (_, args, context) => {
                // If permission has "rwd" property set, but "w" is not part of it, bail.
                const pbCategoryPermission = await context.security.getPermission("pb.category");
                if (pbCategoryPermission && !hasRwd({ pbCategoryPermission, rwd: "w" })) {
                    return new NotAuthorizedResponse();
                }

                const { categories } = context;
                const { slug, data } = args;

                let category = await categories.get(slug);
                if (!category) {
                    return new NotFoundResponse(`Category "${slug}" not found.`);
                }

                // If user can only manage own records, let's check if he owns the loaded one.
                if (pbCategoryPermission?.own === true) {
                    const identity = context.security.getIdentity();
                    if (category.createdBy.id !== identity.id) {
                        return new NotAuthorizedResponse();
                    }
                }

                await categories.update(data);

                category = await categories.get(slug);
                return new Response(category);
            }),
            deleteCategory: pipe(
                hasPermission("pb.category"),
                hasContentLocalePermission()
            )(async (_, args, context) => {
                // If permission has "rwd" property set, but "d" is not part of it, bail.
                const pbCategoryPermission = await context.security.getPermission("pb.category");
                if (pbCategoryPermission && !hasRwd({ pbCategoryPermission, rwd: "d" })) {
                    return new NotAuthorizedResponse();
                }

                const { categories } = context;
                const { slug } = args;

                const category = await categories.get(slug);
                if (!category) {
                    return new NotFoundResponse(`Category "${args.slug}" not found.`);
                }

                // If user can only manage own records, let's check if he owns the loaded one.
                if (pbCategoryPermission?.own === true) {
                    const identity = context.security.getIdentity();
                    if (category.createdBy.id !== identity.id) {
                        return new NotAuthorizedResponse();
                    }
                }

                await categories.delete(slug);

                return new Response(category);
            })
        }
    }
};
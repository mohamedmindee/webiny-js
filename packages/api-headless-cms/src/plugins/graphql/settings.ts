import { compose, ErrorResponse, Response } from "@webiny/handler-graphql";
import { hasManageSettingsPermission } from "../../common/helpers";
import { hasI18NContentPermission } from "@webiny/api-i18n-content";
import { HeadlessCmsContext } from "../../types";

export default {
    typeDefs: /* GraphQL */ `
        extend type CmsQuery {
            # Is CMS installed?
            isInstalled: CmsBooleanResponse
        }

        extend type CmsMutation {
            # Install CMS
            install: CmsBooleanResponse
        }
    `,
    resolvers: {
        CmsQuery: {
            isInstalled: compose(
                hasManageSettingsPermission(),
                hasI18NContentPermission()
            )(async (_, __, context: HeadlessCmsContext) => {
                try {
                    const settings = await context.crud.settings.get();
                    return new Response(!!settings?.isInstalled);
                } catch (ex) {
                    if (ex instanceof ErrorResponse) {
                        return ex;
                    }
                    return new ErrorResponse({
                        code: "CMS_SETTINGS_ERROR",
                        message: ex.message
                    });
                }
            })
        },
        CmsMutation: {
            install: compose(
                hasManageSettingsPermission(),
                hasI18NContentPermission()
            )(async (_, __, context: HeadlessCmsContext) => {
                try {
                    await context.crud.settings.install();
                    return new Response(true);
                } catch (ex) {
                    if (ex instanceof ErrorResponse) {
                        return ex;
                    }
                    return new ErrorResponse({
                        code: "CMS_INSTALLATION_ERROR",
                        message: ex.message
                    });
                }
            })
        }
    }
};
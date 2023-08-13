import { User, getUser } from "@supabase/auth-helpers-nextjs";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next";
import { ParsedUrlQuery } from "querystring";

export type GetServerSidePropsWithUser<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Q, D>,
  user: User
) => Promise<GetServerSidePropsResult<P>>;

interface WithUserOptions {
  getServerSideProps?: GetServerSidePropsWithUser;
}

type WithUserResult = {
  props: {
    user: User;
    [key: string]: any;
  };
  [key: string]: any;
};

const withUser =
  (options?: WithUserOptions) => async (ctx: GetServerSidePropsContext) => {
    try {
      const { user } = await getUser(ctx);

      if (!user) {
        throw new Error("User not found");
      }

      let initialResult: WithUserResult = {
        props: {
          user,
        },
      };

      const serverSideResult = await options?.getServerSideProps?.(ctx, user);

      if (serverSideResult) {
        initialResult = {
          ...serverSideResult,
          props: {
            user,
            ...("props" in serverSideResult && serverSideResult.props),
          },
        };
      }

      return initialResult;
    } catch (error) {
      return {
        redirect: {
          statusCode: 302,
          destination: `/login`,
        },
      };
    }
  };

export default withUser;

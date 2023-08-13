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
    let globalUser: User = null;

    try {
      const { user } = await getUser(ctx);

      console.log(user);

      if (!user) {
        throw new Error("User not found");
      }

      globalUser = user;
    } catch (error) {
      console.log("with user", error);

      return {
        redirect: {
          statusCode: 302,
          destination: `/login`,
        },
      };
    }

    try {
      let initialResult: WithUserResult = {
        props: {
          user: globalUser,
        },
      };

      const serverSideResult = await options?.getServerSideProps?.(
        ctx,
        globalUser
      );

      if (serverSideResult) {
        initialResult = {
          ...serverSideResult,
          props: {
            user: globalUser,
            ...("props" in serverSideResult && serverSideResult.props),
          },
        };
      }

      return initialResult;
    } catch (err) {
      console.log("error", err);

      return {
        redirect: {
          statusCode: 302,
          destination: `/register`,
        },
      };
    }
  };

export default withUser;

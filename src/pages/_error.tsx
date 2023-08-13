import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Link from "@/components/shared/Link";
import Section from "@/components/shared/Section";
import { NextPage } from "next";
import NextErrorComponent, { ErrorProps } from "next/error";

interface CustomErrorProps extends ErrorProps {
  hasGetInitialPropsRun: boolean;
  err?: Error & {
    statusCode: number;
  };
}

// @ts-ignore
const ErrorPage: NextPage<CustomErrorProps, CustomErrorProps> = ({
  statusCode,
  err,
  title,
}) => {
  return (
    <div className="relative w-full min-h-screen flex items-center">
      <Head title={`Error ${statusCode} - Kaguya`} />

      <div className="fixed z-0 w-full h-full flex items-center justify-center">
        <h1 className="font-bold text-[30vw] text-gray-500">{statusCode}</h1>

        <div className="absolute inset-0 bg-black/90 w-full h-full"></div>
      </div>

      <Section className="relative z-10 flex flex-col items-center w-full h-full text-center ">
        <div className="mb-4 text-gray-300">
          <div className="text-lg">
            Welcome to{" "}
            <span className="text-red-300">the {statusCode} dimension</span>
          </div>
        </div>

        <p className="text-4xl font-semibold">You found new dimension</p>

        <p className="text-2xl text-gray-200 mt-4">Nothing here tho</p>

        <p>
          <i>Error: {title || JSON.stringify(err)}</i>
        </p>

        <Link href="/">
          <a>
            <Button primary outline className="mt-8">
              <p className="text-lg">Go back</p>
            </Button>
          </a>
        </Link>
      </Section>
    </div>
  );
};

// @ts-ignore
ErrorPage.getLayout = (page) => page;

// @ts-ignore
ErrorPage.getInitialProps = async (context) => {
  return await NextErrorComponent.getInitialProps(context);
};

export default ErrorPage;

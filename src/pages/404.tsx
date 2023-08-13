import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Section from "@/components/shared/Section";
import Link from "@/components/shared/Link";

function ErrorPage() {
  return (
    <div className="relative w-full min-h-screen flex items-center">
      <Head title={`404 - Kaguya`} />

      <div className="fixed z-0 w-full h-full flex items-center justify-center">
        <h1 className="font-bold text-[30vw] text-gray-500">404</h1>

        <div className="absolute inset-0 bg-black/90 w-full h-full"></div>
      </div>

      <Section className="relative z-10 flex flex-col items-center w-full h-full text-center ">
        <div className="mb-4 text-gray-300">
          <div className="text-lg">
            Welcome to <span className="text-red-300">the 404 dimension</span>
          </div>
        </div>

        <p className="text-4xl font-semibold">You found new dimension</p>

        <p className="text-2xl text-gray-200 mt-4">Nothing here tho</p>

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
}

ErrorPage.getLayout = (page) => page;

export default ErrorPage;

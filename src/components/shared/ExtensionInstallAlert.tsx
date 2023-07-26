import React, { useMemo } from "react";
import Button from "./Button";
import { isChrome, isEdge, isOpera } from "react-device-detect";
import { AiOutlineChrome } from "react-icons/ai";
import { RiEdgeLine, RiOperaFill } from "react-icons/ri";
import Link from "./Link";

const ExtensionInstallAlert = () => {
  const BrowserIcon = useMemo(() => {
    if (isChrome) {
      return AiOutlineChrome;
    }

    if (isEdge) {
      return RiEdgeLine;
    }

    if (isOpera) {
      return RiOperaFill;
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-2xl font-semibold text-center mb-2">
        Extension is not installed.{" "}
      </p>

      <p className="text-xl mb-4">
        To ensure seamless website functionality, the installation of the
        extension is now required.
      </p>

      <div className="flex items-center gap-2">
        <a
          target="_blank"
          href="https://github.com/hoangvu12/kaguya-extension/releases/latest"
          rel="noreferrer"
        >
          <Button primary outline LeftIcon={BrowserIcon}>
            Install the extension
          </Button>
        </a>

        <Link href="/extension-install">
          <a>
            <Button outline className="hover:bg-white/20">
              Learn more
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ExtensionInstallAlert;

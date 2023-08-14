import Section, { SectionProps } from "@/components/shared/Section";
import React, { useEffect, useState } from "react";

interface UploadContainerProps extends SectionProps {
  isVerified?: boolean;
}

const EXT_RETRY = 3;
let retry = 0;

const UploadContainer: React.FC<UploadContainerProps> = ({
  children,
  ...props
}) => {
  const [hasInstalledExt, setHasInstalledExt] = useState(false);

  useEffect(() => {
    const checkIfInstalled = async () => {
      if (!window?.__kaguya__?.extId) {
        if (retry >= EXT_RETRY) return;

        retry++;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        await checkIfInstalled();
      } else {
        setHasInstalledExt(!!window?.__kaguya__?.extId);
      }
    };

    checkIfInstalled();
  }, []);

  return (
    <Section {...props}>
      {!hasInstalledExt ? (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-2xl">
            Please{" "}
            <a
              target="_blank"
              className="text-primary-300 hover:underline transition duration-300"
              href="https://chrome.google.com/webstore/detail/jhinkdokgbijplmedcpkjdbcmjgockgc/"
              rel="noreferrer"
            >
              install{" "}
            </a>
            Kaguya extension to upload
          </h1>
        </div>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </Section>
  );
};

export default UploadContainer;

import Section, { SectionProps } from "@/components/shared/Section";
import React from "react";

interface UploadContainerProps extends SectionProps {
  isVerified?: boolean;
}

const UploadContainer: React.FC<UploadContainerProps> = ({
  children,
  ...props
}) => {
  return (
    <Section {...props}>
      {typeof window !== "undefined" && !window?.__kaguya__?.extId ? (
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

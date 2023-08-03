import Head from "@/components/shared/Head";
import Section from "@/components/shared/Section";
import { DISCORD_URL } from "@/constants";
import React from "react";

const ExtensionInstallPage = () => {
  return (
    <Section className="py-24 prose prose-invert prose-xl min-w-full">
      <Head title="Moving to Chrome extension - Kaguya" />

      <h1>Moving to Chrome extension</h1>

      <p>
        Starting from <b>July 27, 2023</b>. We will be transitioning to a more
        efficient and cost-effective solution by removing the need for an
        external server. Instead, we are proud to present our new and improved
        method of streaming through a Chrome extension!
      </p>

      <p>
        What does this mean for you? Now you can enjoy streaming directly from
        your Chrome browser, you&apos;ll experience faster loading times,
        improved streaming quality, and a more seamless browsing experience
        overall.
      </p>

      <p>
        To begin, you have two options: you can either{" "}
        <a
          target="_blank"
          href="https://chrome.google.com/webstore/detail/kaguya/jhinkdokgbijplmedcpkjdbcmjgockgc"
          rel="noreferrer"
        >
          install
        </a>{" "}
        the extension directly from the Chrome Web Store, or you can follow the
        manual installation instructions provided in this{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/hoangvu12/kaguya-extension/#how-to-install"
        >
          link
        </a>{" "}
        on GitHub.
      </p>

      <p>
        We understand that change can sometimes be challenging, but we truly
        believe that this switch will bring about a more enjoyable and
        accessible anime streaming experience for all our users. Moreover,
        removing the server will enable us to continue offering our services at
        no cost to you, ensuring that anime remains easily accessible to fans
        from all walks of life.
      </p>

      <p>
        If you encounter any issues during the installation process or while
        using the Chrome extension, please don&apos;t hesitate to reach out to
        our{" "}
        <a target="_blank" href={DISCORD_URL} rel="noreferrer">
          Discord server
        </a>
        . We are always here to assist you and ensure your seamless transition.
      </p>

      <p>
        Thank you for your unwavering support, and we look forward to embarking
        on this new chapter with you. Together, let&apos;s explore the vast and
        captivating world of anime through our streamlined and more convenient
        platform!
      </p>

      <p>
        Best regards,
        <br />
        Kaguya Team
      </p>
    </Section>
  );
};

export default ExtensionInstallPage;

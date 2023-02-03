import Head from "@/components/shared/Head";
import Image from "@/components/shared/Image";
import Section from "@/components/shared/Section";
import React from "react";

const DonatePage = () => {
  return (
    <React.Fragment>
      <Head
        title="Donate - Kaguya"
        description="Make a difference and support us by donating today. Your generosity helps us bring the best entertainment and user experience to you. Every contribution, no matter how small, goes a long way in making a positive impact."
      />

      <Section className="flex py-24 gap-16">
        <div className="hidden md:block relative w-[30%] h-[638px]">
          <Image
            src="/donate-hero.png"
            layout="fill"
            className="w-full h-full object-cover"
            unoptimized
            alt="Donate hero"
          />
        </div>

        <div className="w-full md:w-[70%] space-y-8 text-base md:text-xl">
          <h1 className="text-4xl font-bold">Make a donation</h1>

          <div className="space-y-2">
            <p className="text-2xl font-semibold !mb-4">
              Why do we need your support?
            </p>

            <p>
              We are dedicated to providing high-quality content and a seamless
              viewing experience for our users. However, maintaining a streaming
              website requires significant resources, including servers,
              bandwidth, and technology.
            </p>
            <p>
              That&apos;s why we are asking for your support in the form of a
              donation. Your contribution will help us keep our website up and
              running, as well as improve the overall user experience with
              better servers and technology upgrades. With your support, we can
              continue to provide the best streaming content for you and the
              entire community.
            </p>
            <p>
              Every donation, no matter how small, helps us in our mission to
              bring the best content to your screens. We are grateful for your
              generosity and support, and we look forward to bringing you even
              more exciting content in the future.
            </p>
            <p>Thank you for your consideration.</p>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-semibold !mb-4">How to support?</p>

            <p>
              We are currently accepting donations via <b>Ko-fi</b>
            </p>

            <p>
              You can either donate using the form below or go to{" "}
              <a
                href="https://ko-fi.com/kaguyaanime/"
                className="text-primary-300 hover:underline"
              >
                Kaguya&apos;s Ko-fi page
              </a>{" "}
            </p>

            <p>
              or{" "}
              <a
                href="https://www.buymeacoffee.com/kaguyaanime"
                className="text-primary-300 hover:underline"
              >
                Kaguya&apos;s buymeacoffee page
              </a>{" "}
            </p>

            <iframe
              className="w-full h-[40rem] !mt-8"
              src="https://ko-fi.com/kaguyaanime/?hidefeed=true&widget=true&embed=true&preview=true"
            />
          </div>
        </div>
      </Section>
    </React.Fragment>
  );
};

export default DonatePage;

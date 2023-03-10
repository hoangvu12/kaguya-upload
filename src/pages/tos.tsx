import NativeBanner from "@/components/features/ads/NativeBanner";
import Head from "@/components/shared/Head";

const TosPage = () => {
  return (
    <div className="prose prose-invert !max-w-full pt-20 px-4 md:px-12 space-y-4">
      <Head
        title="Điều khoản dịch vụ - Kaguya"
        description="Điều khoản dịch vụ tại Kaguya"
      />

      <NativeBanner />

      <h1>Terms of Service</h1>

      <p>
        Welcome to our anime streaming website. By using our website, you agree
        to be bound by the following terms and conditions (&quot;Terms of
        Service&quot;). If you do not agree to these Terms of Service, please do
        not use our website.
      </p>

      <ul>
        <li>
          <p>
            <b>Use of Website</b>
          </p>

          <p>
            You may use our website for your personal, non-commercial use only.
            You may not use our website for any illegal or unauthorized purpose.
            You agree to comply with all applicable laws and regulations in your
            use of our website.
          </p>
        </li>

        <li>
          <p>
            <b>Intellectual Property</b>
          </p>

          <p>
            All content on our website, including but not limited to text,
            graphics, images, logos, and software, is the property of our
            website or its licensors and is protected by United States and
            international copyright laws. You may not reproduce, distribute,
            display, or transmit any content on our website without our prior
            written permission.
          </p>
        </li>

        <li>
          <p>
            <b>User Content</b>
          </p>

          <p>
            You may submit content to our website, including but not limited to
            comments, reviews, and ratings. By submitting content to our
            website, you grant us a non-exclusive, worldwide, royalty-free,
            perpetual, irrevocable, and fully sublicensable license to use,
            reproduce, modify, adapt, publish, translate, create derivative
            works from, distribute, and display such content in any form, media,
            or technology now known or hereafter developed.
          </p>
        </li>

        <li>
          <p>
            <b>Disclaimer of Warranties</b>
          </p>

          <p>
            Our website is provided on an &quot;as is&quot; and &quot;as
            available&quot; basis. We make no representations or warranties of
            any kind, express or implied, as to the operation of our website or
            the information, content, materials, or products included on our
            website. You expressly agree that your use of our website is at your
            sole risk.
          </p>
        </li>

        <li>
          <p>
            <b>Limitation of Liability</b>
          </p>

          <p>
            In no event shall our website or its affiliates be liable for any
            direct, indirect, incidental, special, or consequential damages
            arising out of or in connection with your use of our website or the
            content on our website. Some states or jurisdictions do not allow
            the exclusion or limitation of liability for consequential or
            incidental damages, so the above limitation may not apply to you.
          </p>
        </li>

        <li>
          <p>
            <b>Indemnification</b>
          </p>

          <p>
            You agree to indemnify and hold harmless our website and its
            affiliates from any claim or demand, including reasonable
            attorneys&apos; fees, made by any third party due to or arising out
            of your use of our website, your violation of these Terms of
            Service, or your violation of any rights of another.
          </p>
        </li>

        <li>
          <p>
            <b>Modification of Terms</b>
          </p>

          <p>
            We reserve the right to modify these Terms of Service at any time.
            Your continued use of our website after any such modification
            constitutes your acceptance of the modified Terms of Service.
          </p>
        </li>

        <li>
          <p>
            <b>Governing Law</b>
          </p>

          <p>
            These Terms of Service shall be governed by and construed in
            accordance with the laws of the United States and the State of
            [insert state]. Any disputes arising out of or related to these
            Terms of Service shall be resolved exclusively in the state or
            federal courts located in [insert county, state].
          </p>
        </li>

        <li>
          <p>
            <b>Contact Us</b>
          </p>

          <p>
            If you have any questions about these Terms of Service, please
            contact us at hggaming07@gmail.com.
          </p>
        </li>
      </ul>

      <p>
        By using our website, you acknowledge that you have read, understand,
        and agree to these Terms of Service.
      </p>
    </div>
  );
};

export default TosPage;

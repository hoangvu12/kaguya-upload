const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  content: [
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.red,

        background: {
          DEFAULT: "#000000",
          200: "#666666",
          300: "#595959",
          400: "#4d4d4d",
          500: "#404040",
          600: "#333333",
          700: "#262626",
          800: "#1a1a1a",
          900: "#0d0d0d",
        },
        typography: {
          DEFAULT: "#FFFFFF",
          secondary: colors.stone["300"],
        },
      },
      typography: ({ theme }) => ({
        primary: {
          css: {
            "--tw-prose-body": "#374151",
            "--tw-prose-headings": "#111827",
            "--tw-prose-lead": "#4b5563",
            "--tw-prose-links": "#111827",
            "--tw-prose-bold": "#111827",
            "--tw-prose-counters": "#6b7280",
            "--tw-prose-bullets": "#d1d5db",
            "--tw-prose-hr": "#e5e7eb",
            "--tw-prose-quotes": "#111827",
            "--tw-prose-quote-borders": "#e5e7eb",
            "--tw-prose-captions": "#6b7280",
            "--tw-prose-code": "#111827",
            "--tw-prose-pre-code": "#e5e7eb",
            "--tw-prose-pre-bg": "#1f2937",
            "--tw-prose-th-borders": "#d1d5db",
            "--tw-prose-td-borders": "#e5e7eb",
            "--tw-prose-invert-body": "#f1f1f1",
            "--tw-prose-invert-headings": "#fff",
            "--tw-prose-invert-lead": "#9ca3af",
            "--tw-prose-invert-links": theme(colors.red[500]),
            "--tw-prose-invert-bold": "#fff",
            "--tw-prose-invert-counters": "#a8b1bd",
            "--tw-prose-invert-bullets": "#a8b1bd",
            "--tw-prose-invert-hr": "#374151",
            "--tw-prose-invert-quotes": "#f3f4f6",
            "--tw-prose-invert-quote-borders": "#374151",
            "--tw-prose-invert-captions": "#9ca3af",
            "--tw-prose-invert-code": "#fff",
            "--tw-prose-invert-pre-code": "#f1f1f1",
            "--tw-prose-invert-pre-bg": "rgb(0 0 0 / 50%)",
            "--tw-prose-invert-th-borders": "#a8b1bd",
            "--tw-prose-invert-td-borders": "#374151",
          },
        },
      }),
    },
  },

  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
};

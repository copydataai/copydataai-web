import { defineConfig } from 'astro/config';
import remarkToc from 'remark-toc';
import remarkCollapse from "remark-collapse";
import tailwind from '@astrojs/tailwind';
import react from "@astrojs/react";

export default defineConfig({
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      wrap: true,
    },
  },
  integrations: [tailwind({
          applyBaseStyles: false,
  }), react()]
});

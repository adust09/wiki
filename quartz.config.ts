import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Shouki Tsuda",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "wiki-92c.pages.dev",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    generateSocialImages: {
      colorScheme: "lightMode", // what colors to use for generating image, same as theme colors from config, valid values are "darkMode" and "lightMode"
      width: 1200, // width to generate with (in pixels)
      height: 630, // height to generate with (in pixels)
      excludeRoot: false, // wether to exclude "/" index path to be excluded from auto generated images (false = use auto, true = use default og image)
    },
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: false,
      typography: {
        header: "JetBrains Mono",
        body: "JetBrains Mono",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#ffffff",
          lightgray: "#e4e4e4",
          gray: "#9d9d9d",
          darkgray: "#3d3d3d",
          dark: "#111111",
          secondary: "#111111",
          tertiary: "#9d9d9d",
          highlight: "rgba(0, 0, 0, 0.06)",
          textHighlight: "#fff23699",
        },
        darkMode: {
          light: "#101010",
          lightgray: "#262626",
          gray: "#6e6e6e",
          darkgray: "#b5b5b5",
          dark: "#ededed",
          secondary: "#ededed",
          tertiary: "#7a7a7a",
          highlight: "rgba(255, 255, 255, 0.07)",
          textHighlight: "#b3aa0299",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config

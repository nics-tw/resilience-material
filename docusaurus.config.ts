import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '數位韌性教材專區',
  tagline: '系統在變動或極端的環境下，持續提供美好的服務，並能在故障時優雅復原',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://nics-tw.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/resilience-material/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nics-tw', // Usually your GitHub org/user name.
  projectName: 'resilience-material', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'material',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/nics-tw/resilience-material/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: '數位韌性教材專區',
      logo: {
        alt: '數位韌性教材 Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'materialSidebar',
          position: 'left',
          label: '教材',
        },
        {
          href: 'https://github.com/nics-tw/resilience-material',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '教材',
          items: [
            {
              label: '數位韌性領航員培訓課程教材',
              to: '/material/training',
            },
            {
              label: '共通性建議教材',
              to: '/material/category/共同性教材',
            }
          ],
        },
        {
          title: '相關連結',
          items: [
            {
              label: '政府網站設計原則',
              href: 'https://guide.nics.nat.gov.tw/'
            },
            {
              label: 'SBOM 銜接 VANS 規格工具',
              href: 'https://github.com/nics-tw/sbom2vans',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}  <a href="https://creativecommons.org/licenses/by-nd/4.0/deed.en" target="_blank">CC-BY-ND-4.0</a>. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.okaidia,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

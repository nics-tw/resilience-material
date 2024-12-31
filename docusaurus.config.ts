import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '數位韌性教材專區',
  tagline: '系統在變動或極端的環境下，持續提供美好的服務，並能在故障時優雅復原',
  favicon: 'img/favicon.ico',

  url: 'https://material.nics.nat.gov.tw',
  baseUrl: '/',

  organizationName: 'nics-tw',
  projectName: 'resilience-material',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          editUrl:
            'https://github.com/nics-tw/resilience-material/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-HY2XBCL1WK',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
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
          label: '共通性建議',
        },
        {
          label: '數位韌性教材', // 新增 Tab
          to: '/material/training',
          position: 'left',
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
          title: '相關連結',
          items: [
            {
              label: '政府網站設計原則',
              href: 'https://guide.nics.nat.gov.tw/',
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

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import 'dotenv/config';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.MEILISEARCH_HOST || !process.env.MEILISEARCH_SEARCH_KEY) {
    console.warn(
      '⚠️  MEILISEARCH_HOST and MEILISEARCH_SEARCH_KEY are not set. Search functionality will be disabled.'
    );
  }
}

const config: Config = {
  title: '數位韌性教材專區',
  tagline: '系統在變動或極端的環境下，持續提供美好的服務，並能在故障時優雅復原',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://material.nics.nat.gov.tw',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nics-tw', // Usually your GitHub org/user name.
  projectName: 'resilience-material', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  customFields: {
    meilisearchHost: process.env.MEILISEARCH_HOST,
    meilisearchApiKey: process.env.MEILISEARCH_SEARCH_KEY,
  },

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
          editUrl:
            'https://github.com/nics-tw/resilience-material/tree/main/',
          showLastUpdateAuthor: true, 
          showLastUpdateTime: true,
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
            {
              label: '國家資通安全研究院 數位韌性',
              href: 'https://www.nics.nat.gov.tw/core_business/digital_resilience/Digital_Resilience_Materials/',
            },
            {
              label: 'YouTube 數位韌性',
              href: 'https://www.youtube.com/@DigitalResilience',
            },
          ],
        },
        {
          title: '聯繫我們',
          items: [
            {
              label: '聯絡信箱',
              href: 'mailto:ra-res@nics.nat.gov.tw', // 點擊會開啟 email
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

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import 'dotenv/config';

// Check for required environment variables in production
// Allow builds without MEILISEARCH in CI environments (e.g., dependabot PRs)
const isCIBuild = !!process.env.CI;
const hasMeilisearchHost = !!process.env.MEILISEARCH_HOST;
const hasMeilisearchKey = !!process.env.MEILISEARCH_SEARCH_KEY;
const hasMeilisearchConfig = hasMeilisearchHost && hasMeilisearchKey;

if (process.env.NODE_ENV === 'production' && !hasMeilisearchConfig) {
  const missingVars = [
    !hasMeilisearchHost && 'MEILISEARCH_HOST',
    !hasMeilisearchKey && 'MEILISEARCH_SEARCH_KEY',
  ].filter(Boolean).join(' and ');
  
  if (isCIBuild) {
    console.warn(
      `⚠️  ${missingVars} not set. Search functionality will be disabled in this CI build.`
    );
  } else {
    throw new Error(
      `${missingVars} required for production builds.`
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

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        // 改版前易用性教材位於 /material/accessbility/，保留舊網址轉址以免外部連結失效
        redirects: [
          {
            // 舊首頁 /material/accessbility/ 曾大量對外散佈，原本顯示隱私與廣告文章。
            // Docusaurus 將同名的 accessbility/accessbility.md 視為目錄首頁；
            // 重構改名後仍應導回該文章，而非易用性分類頁。
            from: '/material/accessbility',
            to: '/material/usability/privacy-and-advertising-best-practices',
          },
          {
            from: '/material/category/易用性',
            to: '/material/usability/',
          },
        ],
        createRedirects(existingPath: string) {
          // 分類首頁不套用文章的轉址規則，避免與舊首頁的明確轉址衝突。
          if (
            existingPath !== '/material/usability/' &&
            existingPath.startsWith('/material/usability/')
          ) {
            return [
              existingPath.replace('/material/usability/', '/material/accessbility/'),
            ];
          }
          return undefined;
        },
      },
    ],
  ],

  themeConfig: {
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
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

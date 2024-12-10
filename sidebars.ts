import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  materialSidebar: [
    {
      type: 'category',
      label: '高可用性', // 按鈕名稱
      collapsed: false, // 預設展開
      link: {
        type: 'doc',
        id: 'common/high-availability', // 指向的文檔
      },
      items: [
        {
          type: 'doc',
          id: 'cdn/cdn-gov-guideline', // CDN 文檔
          label: '政府憑證如何使用於 CDN 之說明',
        },
      ],
    },
    {
      type: 'category', // 可維護性改為分類
      label: '可維護性',
      collapsed: false, // 預設展開
      link: {
        type: 'doc',
        id: 'common/maintainable',
      },
      items: [
        {
          type: 'doc',
          id: 'ci-cd-guideline',
          label: 'CI/CD - 於 GitHub 上建立自動生成 SBOM 及漏洞掃描',
        },
        {
          type: 'doc',
          id: 'sbom/Guide_to_SBOM_and_OSV_Tools',
          label: 'SBOM 開源工具使用說明',
        },
      ],
    },
    {
      type: 'doc',
      id: 'common/usability',
      label: '易用性',
    },
  ],
};

export default sidebars;
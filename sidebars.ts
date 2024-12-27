import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  materialSidebar: [
    {
      type: 'category',
      label: '易用性',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'accessbility/accessbility', // 指向主文檔
      },
      items: [
        {
          type: 'doc',
          id: 'accessbility/digital-accessibility', // 子文檔
          label: '組織中的網頁可及性：角色與職責',
        },
      ],
    },
    {
      type: 'category',
      label: '可維護性',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'maintainable/maintainable', // 指向主文檔
      },
      items: [
        {
          type: 'doc',
          id: 'maintainable/ci-cd-guideline', // 子文檔
          label: 'CI/CD - 於 GitHub 上建立自動生成 SBOM 及漏洞掃描',
        },
        {
          type: 'doc',
          id: 'maintainable/Guide_to_SBOM_and_OSV_Tools', // 子文檔
          label: 'SBOM 開源工具使用說明',
        },
        {
          type: 'doc',
          id: 'maintainable/operational-excellence', // 子文檔
          label: '卓越營運設計原則',
        },
        {
          type: 'doc',
          id: 'maintainable/operational-excellence-cloud', // 子文檔
          label: '支援卓越營運的雲端架構設計模式',
        },
      ],
    },
    {
      type: 'category',
      label: '高可用性',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'high-availability/high-availability', // 指向主文檔
      },
      items: [
        {
          type: 'doc',
          id: 'high-availability/cdn-gov-guideline', // 子文檔
          label: '政府憑證如何使用於 CDN 之說明',
        },
        {
          type: 'doc',
          id: 'high-availability/system-reliability', // 子文檔
          label: '可靠性設計原則',
        },
        {
          type: 'doc',
          id: 'high-availability/high-reliability-cloud', // 子文檔
          label: '支援高可靠性的雲端架構設計模式',
        },
      ],
    },
  ],
};

export default sidebars;
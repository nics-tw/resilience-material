import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  materialSidebar: [
    {
      type: 'doc',
      id: 'summary', // 指向 summary.md
      label: '數位韌性', // 顯示的標籤
    },
    {
      type: 'category',
      label: '易用性',
      collapsed: false,
      link: {
        type: 'generated-index',
      },
      items: [{ type: 'autogenerated', dirName: 'accessbility' }], // 自動從 accessbility 資料夾生成
    },
    {
      type: 'category',
      label: '可維護性',
      collapsed: false,
      link: {
        type: 'generated-index',
      },
      items: [{ type: 'autogenerated', dirName: 'maintainable' }], // 自動從 maintainable 資料夾生成
    },
    {
      type: 'category',
      label: '高可用性',
      collapsed: false,
      link: {
        type: 'generated-index',
      },
      items: [{ type: 'autogenerated', dirName: 'high-availability' }], // 自動從 high-availability 資料夾生成
    },
  ],
};

export default sidebars;
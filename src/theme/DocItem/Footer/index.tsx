import React, {type ReactNode} from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      {/* 原始 Footer */}
      <div style={{ flex: 1 }}>
        <Footer {...props} />
      </div>
      {/* 新增的回報建議按鈕 */}
      <div>
        <a
          href="https://github.com/nics-tw/resilience-material/issues"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            fontSize: 'var(--ifm-font-size-base)', // 與樣式一致
            lineHeight: '1.5', // 避免文字垂直偏移
          }}
        >
          回報建議
        </a>
      </div>
    </div>
  );
}

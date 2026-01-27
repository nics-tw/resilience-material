import React, {type ReactNode} from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type {WrapperProps} from '@docusaurus/types';

import styles from './styles.module.css';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  return (
    <div className={styles.footerContainer}>
      {/* 原始 Footer */}
      <div className={styles.originalFooter}>
        <Footer {...props} />
      </div>

      {/* 新增的回報建議按鈕 */}
      <a
        href="https://github.com/nics-tw/resilience-material/issues"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.feedbackLink}>
        回報建議
      </a>
    </div>
  );
}

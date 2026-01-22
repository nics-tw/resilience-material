import React, { ReactNode, Children, isValidElement, useMemo, Fragment } from 'react';
import Head from '@docusaurus/Head';
import styles from './styles.module.css';

interface FAQItemProps {
  question: string;
  children: ReactNode;
}

export const FAQItem = ({ question, children }: FAQItemProps): JSX.Element => {
  return (
    <details className={styles.faqItem}>
      <summary className={styles.summary}>
        {question}
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
};

interface FAQGroupProps {
  children: ReactNode;
}

// 輔助函式：從 ReactNode 中提取純文字
const getTextFromNode = (node: ReactNode): string => {
  if (node === null || node === undefined) {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextFromNode).join(' ');
  }
  if (isValidElement(node)) {
    // 處理 Fragment
    if (node.type === Fragment && node.props.children) {
      return getTextFromNode(node.props.children);
    }
    // 處理一般元件的 children
    if (node.props && node.props.children) {
      return getTextFromNode(node.props.children);
    }
  }
  return '';
};

export const FAQGroup = ({ children }: FAQGroupProps): JSX.Element => {
  const jsonLd = useMemo(() => {
    const faqItems: { question: string; answer: string }[] = [];

    // 遍歷子元件以提取問答內容用於 JSON-LD
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type === FAQItem) {
        const props = child.props as FAQItemProps;
        const answerText = getTextFromNode(props.children).trim().replace(/\s+/g, ' ');

        faqItems.push({
          question: props.question,
          answer: answerText,
        });
      }
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };
  }, [children]);

  return (
    <div className={styles.faqGroup}>
      <Head>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      {children}
    </div>
  );
};

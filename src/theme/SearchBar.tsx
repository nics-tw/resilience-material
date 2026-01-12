import React, { useEffect, useRef } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function SearchBar(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const { siteConfig } = useDocusaurusContext();
  const { meilisearchHost, meilisearchApiKey } = (siteConfig.customFields ?? {}) as {
    meilisearchHost?: string;
    meilisearchApiKey?: string;
  };

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM || !containerRef.current) return;
    if (!meilisearchHost || !meilisearchApiKey) return;

    let cleanup: (() => void) | undefined;

    // 動態 import 避免 SSR 問題
    const initDocsearch = async () => {
      try {
        const { docsearch } = await import('meilisearch-docsearch');

        if (containerRef.current) {
          containerRef.current.innerHTML = ''; // 清除之前的實例
          
          cleanup = docsearch({
            container: containerRef.current,
            host: meilisearchHost,
            apiKey: meilisearchApiKey,
            indexUid: 'docs',
            debounceDuration: 350,
            checkCompositionEvent: true,
          });
        }
      } catch (error) {
        console.error('Failed to initialize docsearch:', error);
      }
    };

    initDocsearch();

    return () => {
      cleanup?.();
    };
  }, [meilisearchHost, meilisearchApiKey]);

  return <div ref={containerRef} />;
}
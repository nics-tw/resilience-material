
import React, { useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function SearchBar(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { meilisearchHost, meilisearchApiKey } = (siteConfig.customFields ?? {}) as {
    meilisearchHost: string;
    meilisearchApiKey: string;
  };

  const scriptUrl = useBaseUrl('/meilisearch-docsearch.js');
  const cssUrl = useBaseUrl('/meilisearch-docsearch.css');

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = () => {
      // @ts-ignore
      if (window.__docsearch_meilisearch__ && meilisearchHost && meilisearchApiKey) {
        // @ts-ignore
        window.__docsearch_meilisearch__.docsearch({
          container: '#docsearch',
          host: meilisearchHost,
          apiKey: meilisearchApiKey,  
          indexUid: 'docs',
          debounceDuration: 350,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Optional cleanup: remove script/link if component unmounts
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, [scriptUrl, cssUrl, meilisearchHost, meilisearchApiKey]);

  return <div id="docsearch" style={{marginTop: '5px'}} />;
}

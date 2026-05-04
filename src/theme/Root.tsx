/**
 * Swizzled Root component — wraps the entire Docusaurus site.
 *
 * Adds focus management after client-side (SPA) navigation:
 * when the route changes, focus is moved to the main content heading
 * so keyboard / screen-reader users don't have to Tab through the
 * entire navbar + sidebar again.
 */
import React, {type ReactNode, useEffect, useRef} from 'react';
import {useLocation} from '@docusaurus/router';

function useFocusOnRouteChange(): void {
  const {pathname} = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Skip the initial render — only act on actual navigation
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // Small delay to let the new page content render
    const timer = setTimeout(() => {
      // Prefer the article heading, fall back to main, then the skip-target
      const target =
        document.querySelector('main h1') ??
        document.querySelector('main') ??
        document.querySelector('#__docusaurus_skipToContent_fallback');

      if (target instanceof HTMLElement) {
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
          target.style.outline = 'none';
          target.addEventListener('blur', () => {
            target.removeAttribute('tabindex');
            target.style.outline = '';
          }, {once: true});
        }
        target.focus({preventScroll: true});
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);
}

export default function Root({children}: {children: ReactNode}): ReactNode {
  useFocusOnRouteChange();
  return <>{children}</>;
}

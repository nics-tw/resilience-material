/**
 * Swizzled (ejected) from @docusaurus/theme-classic DocSidebarItem/Category.
 *
 * Customisation: added a ref on the <li> element so that level-1 categories
 * scroll into view when expanded — without wrapping <Category> in a <div>,
 * which would break the <ul> > <li> accessibility contract.
 */
import React, {type ReactNode, useEffect, useId, useMemo, useRef} from 'react';
import clsx from 'clsx';
import {
  ThemeClassNames,
  useThemeConfig,
  usePrevious,
  Collapsible,
  useCollapsible,
} from '@docusaurus/theme-common';
import {isSamePath} from '@docusaurus/theme-common/internal';
import {
  isActiveSidebarItem,
  findFirstSidebarItemLink,
  useDocSidebarItemsExpandedState,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import DocSidebarItems from '@theme/DocSidebarItems';
import DocSidebarItemLink from '@theme/DocSidebarItem/Link';
import type {Props} from '@theme/DocSidebarItem/Category';
import styles from './styles.module.css';

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useAutoExpandActiveCategory({
  isActive,
  collapsed,
  updateCollapsed,
  activePath,
}: {
  isActive: boolean;
  collapsed: boolean;
  updateCollapsed: (toCollapsed?: boolean) => void;
  activePath: string;
}) {
  const wasActive = usePrevious(isActive);
  const previousActivePath = usePrevious(activePath);
  useEffect(() => {
    const justBecameActive = isActive && !wasActive;
    const stillActiveButPathChanged =
      isActive && wasActive && activePath !== previousActivePath;
    if ((justBecameActive || stillActiveButPathChanged) && collapsed) {
      updateCollapsed(false);
    }
  }, [
    isActive,
    wasActive,
    collapsed,
    updateCollapsed,
    activePath,
    previousActivePath,
  ]);
}

function useCategoryHrefWithSSRFallback(
  item: Props['item'],
): string | undefined {
  const isBrowser = useIsBrowser();
  return useMemo(() => {
    if (item.href && !item.linkUnlisted) {
      return item.href;
    }
    if (isBrowser || !item.collapsible) {
      return undefined;
    }
    return findFirstSidebarItemLink(item);
  }, [item, isBrowser]);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CollapseButton({
  collapsed,
  categoryLabel,
  onClick,
  controlsId,
}: {
  collapsed: boolean;
  categoryLabel: string;
  onClick: React.MouseEventHandler;
  controlsId?: string;
}) {
  return (
    <button
      aria-label={
        collapsed
          ? translate(
              {
                id: 'theme.DocSidebarItem.expandCategoryAriaLabel',
                message: "Expand sidebar category '{label}'",
                description: 'The ARIA label to expand the sidebar category',
              },
              {label: categoryLabel},
            )
          : translate(
              {
                id: 'theme.DocSidebarItem.collapseCategoryAriaLabel',
                message: "Collapse sidebar category '{label}'",
                description: 'The ARIA label to collapse the sidebar category',
              },
              {label: categoryLabel},
            )
      }
      aria-expanded={!collapsed}
      aria-controls={controlsId}
      type="button"
      className="clean-btn menu__caret"
      onClick={onClick}
    />
  );
}

function CategoryLinkLabel({label}: {label: string}) {
  return (
    <span title={label} className={styles.categoryLinkLabel}>
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function DocSidebarItemCategory(props: Props): ReactNode {
  const visibleChildren = useVisibleSidebarItems(
    props.item.items,
    props.activePath,
  );
  if (visibleChildren.length === 0) {
    return <DocSidebarItemCategoryEmpty {...props} />;
  }
  return <DocSidebarItemCategoryCollapsible {...props} />;
}

function isCategoryWithHref(
  category: Props['item'],
): category is Props['item'] & {href: string} {
  return typeof category.href === 'string';
}

function DocSidebarItemCategoryEmpty({item, ...props}: Props): ReactNode {
  if (!isCategoryWithHref(item)) {
    return null;
  }
  const {
    type: _type,
    collapsed: _collapsed,
    collapsible: _collapsible,
    items: _items,
    linkUnlisted: _linkUnlisted,
    ...forwardableProps
  } = item;
  const linkItem = {type: 'link' as const, ...forwardableProps};
  return <DocSidebarItemLink item={linkItem} {...props} />;
}

function DocSidebarItemCategoryCollapsible({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): ReactNode {
  const {items, label, collapsible, className, href} = item;
  const reactId = useId();
  const collapsibleId = `sidebar-list-${reactId}`;
  const isSidebarSubgroup = className?.includes('sidebar-subgroup');
  const {
    docs: {
      sidebar: {autoCollapseCategories},
    },
  } = useThemeConfig();
  const hrefWithSSRFallback = useCategoryHrefWithSSRFallback(item);
  const isActive = isActiveSidebarItem(item, activePath);
  const isCurrentPage = isSamePath(href, activePath);
  const {collapsed, setCollapsed} = useCollapsible({
    initialState: () => {
      if (!collapsible) {
        return false;
      }
      return isActive ? false : item.collapsed;
    },
  });
  const {expandedItem, setExpandedItem} = useDocSidebarItemsExpandedState();
  const updateCollapsed = (toCollapsed = !collapsed) => {
    setExpandedItem(toCollapsed ? null : index);
    setCollapsed(toCollapsed);
  };
  useAutoExpandActiveCategory({
    isActive,
    collapsed,
    updateCollapsed,
    activePath,
  });
  useEffect(() => {
    if (
      collapsible &&
      expandedItem != null &&
      expandedItem !== index &&
      autoCollapseCategories
    ) {
      setCollapsed(true);
    }
  }, [collapsible, expandedItem, index, setCollapsed, autoCollapseCategories]);

  // -- Custom: ref on <li> for scroll-into-view on expand (level 1 only) --
  const liRef = useRef<HTMLLIElement>(null);

  // -- Custom: set id on the collapsible <ul> for aria-controls --
  // Re-run when collapsed changes, since the <ul> is lazily rendered.
  useEffect(() => {
    if (!liRef.current) return;
    const setId = () => {
      const collapsibleList = liRef.current?.querySelector(':scope > ul.menu__list');
      if (collapsibleList) {
        collapsibleList.id = collapsibleId;
      }
    };
    // Try immediately and after a short delay (for animation/lazy render)
    setId();
    const timer = setTimeout(setId, 100);
    return () => clearTimeout(timer);
  }, [collapsibleId, collapsed]);

  useEffect(() => {
    if (level !== 1 || !liRef.current) return;

    const collapsibleEl = liRef.current.querySelector(
      '.menu__list-item-collapsible',
    );
    if (!collapsibleEl) return;

    let prevCollapsed = true;

    const observer = new MutationObserver(() => {
      const expanded = collapsibleEl.querySelector('[aria-expanded="true"]');
      if (expanded && prevCollapsed) {
        setTimeout(() => {
          liRef.current?.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        }, 300);
      }
      prevCollapsed = !expanded;
    });

    observer.observe(collapsibleEl, {
      attributes: true,
      subtree: true,
      attributeFilter: ['aria-expanded'],
    });

    return () => observer.disconnect();
  }, [level]);
  // -- End custom --

  const isTopLevelCategory = !isSidebarSubgroup && collapsible && href;

  const handleItemClick = (e: React.MouseEvent) => {
    onItemClick?.(item);
    if (isTopLevelCategory) {
      e.preventDefault();
      updateCollapsed();
      return;
    }
    if (collapsible) {
      if (href) {
        if (isCurrentPage) {
          e.preventDefault();
          updateCollapsed();
        } else {
          updateCollapsed(false);
        }
      } else {
        e.preventDefault();
        updateCollapsed();
      }
    }
  };

  return (
    <li
      ref={liRef}
      className={clsx(
        ThemeClassNames.docs.docSidebarItemCategory,
        ThemeClassNames.docs.docSidebarItemCategoryLevel(level),
        'menu__list-item',
        {
          'menu__list-item--collapsed': collapsed,
        },
        className,
      )}>
      <div
        className={clsx('menu__list-item-collapsible', {
          'menu__list-item-collapsible--active': isCurrentPage,
        })}>
        <Link
          className={clsx(styles.categoryLink, 'menu__link', {
            'menu__link--sublist': collapsible,
            'menu__link--sublist-caret': (!href || isTopLevelCategory) && collapsible,
            'menu__link--active': isActive,
          })}
          onClick={handleItemClick}
          aria-current={isCurrentPage ? 'page' : undefined}
          role={collapsible && (!href || isTopLevelCategory) ? 'button' : undefined}
          aria-expanded={collapsible && (!href || isTopLevelCategory) ? !collapsed : undefined}
          aria-controls={collapsible && (!href || isTopLevelCategory) ? collapsibleId : undefined}
          href={isTopLevelCategory ? undefined : (collapsible ? hrefWithSSRFallback ?? '#' : hrefWithSSRFallback)}
          {...props}
          tabIndex={isSidebarSubgroup ? -1 : props.tabIndex}>
          <CategoryLinkLabel label={label} />
        </Link>
        {href && collapsible && !isTopLevelCategory && (
          <CollapseButton
            collapsed={collapsed}
            categoryLabel={label}
            controlsId={collapsibleId}
            onClick={(e) => {
              e.preventDefault();
              updateCollapsed();
            }}
          />
        )}
      </div>

      <Collapsible lazy as="ul" className="menu__list" collapsed={collapsed}>
        <DocSidebarItems
          items={items}
          tabIndex={collapsed ? -1 : 0}
          onItemClick={onItemClick}
          activePath={activePath}
          level={level + 1}
        />
      </Collapsible>
    </li>
  );
}

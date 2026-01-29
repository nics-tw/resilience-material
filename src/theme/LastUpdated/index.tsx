import React, {type ReactNode} from 'react';
import Translate from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/LastUpdated';

/**
 * Git 使用者資訊的對照表結構
 * @property githubId - GitHub 的帳號名稱，用於產生個人頁面連結
 * @property displayName - 顯示於頁面上的名稱，若未提供則顯示 Git 使用者名稱
 */
type UserInfo = {
  githubId: string;
  displayName?: string;
};

const userAliasList: {
  githubId: string;
  displayName: string;
  aliases: string[];
}[] = [
  {
    githubId: 'nonumpa',
    displayName: 'Benson Su',
    aliases: ['Benson', 'Benson Su', 'Nonumpa'],
  },
  {
    githubId: 'tony140407',
    displayName: 'Blue',
    aliases: ['Blue', 'tony140407'],
  },
  {
    githubId: 'CharlesChiuGit',
    displayName: 'Charles Chiu',
    aliases: ['Charles Chiu', 'CharlesChiuGit'],
  },
  {
    githubId: 'drhuang0922',
    displayName: 'Dory Huang',
    aliases: ['Dory Huang', 'drhuang0922'],
  },
  {
    githubId: 'IK-Ngoo',
    displayName: 'IK-Ngoo',
    aliases: ['IK-Ngoo'],
  },
  {
    githubId: 'keroro-nics',
    displayName: 'keroro-nics',
    aliases: ['keroro-nics'],
  },
  {
    githubId: 'focaaby',
    displayName: 'Mao-Lin Wang',
    aliases: ['Mao-Lin Wang'],
  },
  {
    githubId: 'luxame',
    displayName: 'William Cheng',
    aliases: ['Luxame', 'William Cheng'],
  },
];

/**
 * Git 使用者名稱（Key）到 GitHub 資訊（Value）的對照表
 */
const USER_MAP: Record<string, UserInfo> = Object.fromEntries(
  userAliasList.flatMap(({aliases, ...userInfo}) =>
    aliases.map((alias) => [alias, userInfo]),
  ),
);

function LastUpdatedAtDate({
  lastUpdatedAt,
}: {
  lastUpdatedAt: number;
}): ReactNode {
  const atDate = new Date(lastUpdatedAt);

  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

  const formattedLastUpdatedAt = dateTimeFormat.format(atDate);

  return (
    <Translate
      id="theme.lastUpdated.atDate"
      description="The words used to describe on which date a page has been last updated"
      values={{
        date: (
          <b>
            <time dateTime={atDate.toISOString()} itemProp="dateModified">
              {formattedLastUpdatedAt}
            </time>
          </b>
        ),
      }}>
      {' on {date}'}
    </Translate>
  );
}

function LastUpdatedByUser({
  lastUpdatedBy,
}: {
  lastUpdatedBy: string;
}): ReactNode {
  const userInfo = USER_MAP[lastUpdatedBy];

  const userDisplayName = userInfo?.displayName ?? lastUpdatedBy;
  const content = userInfo ? (
    <a
      href={`https://github.com/${userInfo.githubId}`}
      target="_blank"
      rel="noopener noreferrer">
      {userDisplayName}
    </a>
  ) : (
    lastUpdatedBy
  );

  return (
    <Translate
      id="theme.lastUpdated.byUser"
      description="The words used to describe by who the page has been last updated"
      values={{
        user: <b>{content}</b>,
      }}>
      {' by {user}'}
    </Translate>
  );
}

export default function LastUpdated({
  lastUpdatedAt,
  lastUpdatedBy,
}: Props): ReactNode {
  return (
    <span className={ThemeClassNames.common.lastUpdated}>
      <Translate
        id="theme.lastUpdated.lastUpdatedAtBy"
        description="The sentence used to display when a page has been last updated, and by who"
        values={{
          atDate: lastUpdatedAt ? (
            <LastUpdatedAtDate lastUpdatedAt={lastUpdatedAt} />
          ) : (
            ''
          ),
          byUser: lastUpdatedBy ? (
            <LastUpdatedByUser lastUpdatedBy={lastUpdatedBy} />
          ) : (
            ''
          ),
        }}>
        {'Last updated{atDate}{byUser}'}
      </Translate>
      {process.env.NODE_ENV === 'development' && (
        <div>
          {/* eslint-disable-next-line @docusaurus/no-untranslated-text */}
          <small> (Simulated during dev for better perf)</small>
        </div>
      )}
    </span>
  );
}

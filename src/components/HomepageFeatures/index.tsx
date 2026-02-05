import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string; // 將 title 保留為純文字
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
  link: string; // 增加一個 link 屬性來指定超連結
};

const FeatureList: FeatureItem[] = [
  {
    title: '易用性',
    Svg: require('@site/static/img/undraw_experience_design.svg').default,
    description: (
      <>
        確保數位服務以使用者需求為核心，協助使用者透過清楚且有效的流程達成目標。
      </>
    ),
    link: '/material/category/易用性',
  },
  {
    title: '可維護性',
    Svg: require('@site/static/img/undraw_engineering_team.svg').default,
    description: (
      <>
        提高程式碼的掌控權，建立自動化 CI/CD 流程，包含自動化產生 SBOM、程式碼檢查、程式碼覆蓋率等。
      </>
    ),
    link: '/material/category/可維護性',
  },
  {
    title: '高可用性',
    Svg: require('@site/static/img/undraw_server_down.svg').default,
    description: (
      <>
        建制高可用性的系統，其 RTO/RPO 數值應符合自動化備份、DR site 恢復等，提供系統穩定性。
      </>
    ),
    link: '/material/category/高可用性',
  },
  {
    title: '附錄',
    Svg: require('@site/static/img/undraw_server_down.svg').default,
    description: (
      <>
        這裡是附錄的內容，提供更多的資訊。
      </>
    ),
    link: '/material/category/附錄',
  },
];

function Feature({ title, Svg, description, link }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      {/* 讓整個圖片可點擊 */}
      <div className="text--center">
        <Link to={link}>
          <Svg className={styles.featureSvg} role="img" aria-label={title} />
        </Link>
      </div>
      
      <div className="text--center padding-horiz--md">
        <Heading as="h2">
          <Link to={link}>{title}</Link>
        </Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
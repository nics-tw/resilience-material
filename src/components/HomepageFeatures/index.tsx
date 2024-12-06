import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: (
      <Link to="/material/common/usability">易用性</Link>
    ),
    Svg: require('@site/static/img/undraw_experience_design.svg').default,
    description: (
      <>
        讓系統更貼近使用者，提供友善的使用者介面，讓使用者能夠上手提高無障礙界面。
      </>
    ),
  },
  {
    title: (
      <Link to="/material/common/maintainable">可維護性</Link>
    ),
    Svg: require('@site/static/img/undraw_engineering_team.svg').default,
    description: (
      <>
        提高程式碼的掌控權，建立自動化 CI/CD 流程，包含自動化產生 SBOM、程式碼檢查、程式碼覆蓋率等。
      </>
    ),
  },
  {
    title: (
      <Link to="/material/common/high-availability">高可用性</Link>
    ),
    Svg: require('@site/static/img/undraw_server_down.svg').default,
    description: (
      <>
        建制高可用性的系統，其 RTO/RPO 數值應符合自動化備份、DR site 恢復等，提供系統穩定性。
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
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

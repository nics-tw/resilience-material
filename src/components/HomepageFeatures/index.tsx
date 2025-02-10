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
        讓系統更貼近使用者，提供友善的使用者介面，讓使用者能夠上手提高無障礙界面。
      </>
    ),
    link: '/material/accessbility',
  },
  {
    title: '可維護性',
    Svg: require('@site/static/img/undraw_engineering_team.svg').default,
    description: (
      <>
        提高程式碼的掌控權，建立自動化 CI/CD 流程，包含自動化產生 SBOM、程式碼檢查、程式碼覆蓋率等。
      </>
    ),
    link: '/material/maintainable',
  },
  {
    title: '高可用性',
    Svg: require('@site/static/img/undraw_server_down.svg').default,
    description: (
      <>
        建制高可用性的系統，其 RTO/RPO 數值應符合自動化備份、DR site 恢復等，提供系統穩定性。
      </>
    ),
    link: '/material/high-availability',
  },
];

function Feature({ title, Svg, description, link }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      {/* 讓整個圖片可點擊 */}
      <div 
        className="text--center" 
        onClick={() => window.location.href = link} 
        style={{ cursor: 'pointer' }} // 滑鼠指標變成可點擊
      >
        <Svg className={styles.featureSvg} role="img" />
      </div>
      
      <div className="text--center padding-horiz--md">
        {/* 讓標題可點擊 */}
        <Heading 
          as="h2" 
          onClick={() => window.location.href = link} 
          style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }} // 保持標題樣式一致
        >
          {title}
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
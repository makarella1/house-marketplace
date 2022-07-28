import styles from './PageContainer.module.scss';

const PageContainer = ({ children = null }) => {
  return (
    <div className={styles.pageContainer}>
      <main>{children}</main>
    </div>
  );
};

export default PageContainer;

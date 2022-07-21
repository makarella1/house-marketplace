import styles from './PageContainer.module.scss';

const PageContainer = ({ children, title }) => {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.headerTitle}>{title}</h2>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default PageContainer;

import styles from './PageHeader.module.scss';

const PageHeader = ({ children = null, className = '', title = '' }) => {
  return (
    <header
      className={
        className ? `${className} ${styles.header}` : `${styles.header}`
      }
    >
      <h2 className={styles.headerTitle}>{title}</h2>
      {children}
    </header>
  );
};

export default PageHeader;

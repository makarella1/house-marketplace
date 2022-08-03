import styles from './LinkAlert.module.scss';

const LinkAlert = () => {
  return (
    <div className={styles.alertContainer}>
      <div className={styles.alert}>
        <div>
          <span className={styles.text}>
            The link was copied to your clipboard!
          </span>
        </div>
      </div>
    </div>
  );
};
export default LinkAlert;

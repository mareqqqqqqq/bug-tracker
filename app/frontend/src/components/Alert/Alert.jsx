import styles from './Alert.module.css';

function Alert({ title, children, type = 'error' }) {
  return (
    <div className={`${styles.alert} ${styles[type]}`} role="alert">
      <span className={'text-m-med'}>{title}</span>
      <span className={styles.message}>{children}</span>
    </div>
  );
}

export default Alert;

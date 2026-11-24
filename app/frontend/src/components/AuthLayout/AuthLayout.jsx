import styles from './AuthLayout.module.css';

function AuthLayout({ children }) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h3 className={styles.logo}>BugTracker</h3>
        {children}
      </div>
    </main>
  );
}

export default AuthLayout;

import { Link } from 'react-router';
import styles from './Header.module.css';

function Header({ user }) {
  return (
    <header className={styles.header}>
      <Link to="/projects" className={`${styles.logo} text-h3`}>
        BugTracker
      </Link>
      <Link to="/projects" className={`${styles.nav} text-m-med`}>
        Проекты
      </Link>
      <div className={styles.user}>
        <div className={styles.avatar} />
        <span>{user.name}</span>
      </div>
    </header>
  );
}

export default Header;

import { Link } from 'react-router';
import styles from './Header.module.css';
import { roleNames } from '../../constants/roles.js';

function Header({ user, role }) {
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
        <span>
          {user.name} {role && ` · ${roleNames[role]}`}
        </span>
      </div>
    </header>
  );
}

export default Header;

import { Link } from 'react-router';
import styles from './Breadcrumbs.module.css';

function Breadcrumbs({ items }) {
  return (
    <nav className={`${styles.breadcrumbs} text-s`}>
      {items.map((item, index) => (
        <span key={item.label} className={styles.item}>
          {index > 0 && <span className={styles.separator}></span>}
          {item.to ? (
            <Link to={item.to} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;

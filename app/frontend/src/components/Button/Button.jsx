import styles from './Button.module.css';

function Button({ children, disabled }) {
  return (
    <button
      className={`${styles.button} ${styles.primary}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;

import styles from './Button.module.css';

function Button({ children, disabled, variant = 'primary' }) {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;

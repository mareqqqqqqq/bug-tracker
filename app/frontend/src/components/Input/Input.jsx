import { useId } from 'react';
import styles from './Input.module.css';

function Input({ label, error, ...rest }) {
  const id = useId();

  return (
    <div className={styles.field}>
      <label className={`${styles.label} text-m-med`} htmlFor={id}>
        {label}
      </label>
      <input
        className={`${styles.input} text-m ${error ? styles.inputError : ''}`}
        id={id}
        {...rest}
      />
      {error && <span className={`${styles.error} text-s`}>{error}</span>}
    </div>
  );
}

export default Input;

import { useId } from 'react';
import styles from './Textarea.module.css';

function Textarea({ label, error, ...rest }) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={`${styles.label} text-m-med`} htmlFor={id}>
        {label}
      </label>
      <textarea
        className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
        id={id}
        {...rest}
      />
      {error && <span className={`${styles.error} text-s`}>{error}</span>}
    </div>
  );
}

export default Textarea;

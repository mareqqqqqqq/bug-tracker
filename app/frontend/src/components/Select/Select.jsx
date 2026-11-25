import { useId } from 'react';
import styles from './Select.module.css';

function Select({ label, error, placeholder, options, value, ...rest }) {
  const id = useId();
  return (
    <div className={styles.field}>
      <label className={`${styles.label} text-m-med`} htmlFor={id}>
        {label}
      </label>
      <div className={styles.wrapper}>
        <select
          className={`${styles.select} ${error ? styles.selectError : ''} ${value ? '' : styles.placeholder}`}
          id={id}
          value={value}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className={`${styles.error} text-s`}>{error}</span>}
    </div>
  );
}

export default Select;

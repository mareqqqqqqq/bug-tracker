import { useState } from 'react';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import AuthLayout from '../components/AuthLayout/AuthLayout.jsx';
import styles from './RegisterPage.module.css';
import { Link } from 'react-router';

function RegisterPage() {
  const [errors, setErrors] = useState({});
  function handleSubmit(event) {
    event.preventDefault();
    setErrors({
      email: 'Неверный формат email',
      password: 'Не короче 8 символов, буква и цифра',
    });
  }
  return (
    <AuthLayout>
      <h1>Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Email"
          placeholder="you@example.com"
          type="email"
          error={errors.email}
        />
        <Input
          label="Пароль"
          placeholder="••••••••"
          type="password"
          error={errors.password}
        />
        <Button>Зарегистрироваться</Button>
        <p className={styles.footer}>
          Уже есть аккаунт?
          <Link to="/login" className={`${styles.link} text-m-med`}>
            Войти
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
export default RegisterPage;

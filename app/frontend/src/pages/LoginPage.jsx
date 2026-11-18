import { useState } from 'react';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import Alert from '../components/Alert/Alert.jsx';
import AuthLayout from '../components/AuthLayout/AuthLayout.jsx';
import styles from './LoginPage.module.css';
import { Link } from 'react-router';

function LoginPage() {
  const [error, setError] = useState('');
  function handleSubmit(event) {
    event.preventDefault();
    setError('Неверный email или пароль');
  }
  return (
    <AuthLayout>
      <h1>Вход</h1>
      {error && <Alert title={error} />}
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input label="Email" placeholder="you@example.com" type="email" />
        <Input label="Пароль" placeholder="••••••••" type="password" />
        <Button>Войти</Button>
        <p className={styles.footer}>
          Нет аккаунта?
          <Link to="/register" className={`${styles.link} text-m-med`}>
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
export default LoginPage;

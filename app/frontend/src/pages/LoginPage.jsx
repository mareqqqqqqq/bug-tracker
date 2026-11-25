import { useState } from 'react';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import Alert from '../components/Alert/Alert.jsx';
import AuthLayout from '../components/AuthLayout/AuthLayout.jsx';
import styles from './LoginPage.module.css';
import { Link, useNavigate } from 'react-router';

function LoginPage() {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/projects');
        return;
      }

      if (response.status >= 500) {
        setError('Ошибка на сервере, попробуйте позже');
        return;
      }

      const data = await response.json();

      if (response.status === 401) {
        setError(data.detail);
      } else {
        setError('Проверьте введённые данные');
      }
    } catch {
      setError('Сервер недоступен, попробуйте позже');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1>Вход</h1>
      {error && <Alert title={error} />}
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Email"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Пароль"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button disabled={loading}>Войти</Button>
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

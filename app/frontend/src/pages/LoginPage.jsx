import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import Alert from '../components/Alert/Alert.jsx';
import AuthLayout from '../components/AuthLayout/AuthLayout.jsx';
import styles from './LoginPage.module.css';
import { Link } from 'react-router';

function LoginPage() {
  return (
    <AuthLayout>
      <h1>Вход</h1>

      <form className={styles.form}>
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

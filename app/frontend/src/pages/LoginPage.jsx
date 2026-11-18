import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import Alert from '../components/Alert/Alert.jsx';
import AuthLayout from '../components/AuthLayout/AuthLayout.jsx';
import styles from './LoginPage.module.css';

function LoginPage() {
  return (
    <AuthLayout>
      <h1>Вход</h1>

      <form className={styles.form}>
        <Input label="Email" placeholder="you@example.com" type="email" />
        <Input label="Пароль" placeholder="••••••••" type="password" />
        <Button>Войти</Button>
      </form>
    </AuthLayout>
  );
}
export default LoginPage;

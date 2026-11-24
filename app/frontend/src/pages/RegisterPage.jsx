import { useState } from 'react';
import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';
import AuthLayout from '../components/AuthLayout/AuthLayout.jsx';
import styles from './RegisterPage.module.css';
import { Link, useNavigate } from 'react-router';
import Alert from '../components/Alert/Alert.jsx';

const errorTexts = {
  name: 'Введите фамилию и имя',
  email: 'Неверный формат email',
  password: 'От 8 до 72 символов',
};

function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      if (response.ok) {
        navigate('/projects');
        return;
      }

      if (response.status >= 500) {
        setErrors({ form: 'Ошибка на сервере, попробуйте позже' });
        return;
      }

      const data = await response.json();

      if (response.status === 409) {
        setErrors({ email: data.detail });
      } else if (response.status === 422) {
        const newErrors = {};
        for (const item of data.detail) {
          const field = item.loc[1];
          if (field === 'password' && item.type === 'value_error') {
            newErrors.password =
              'Слишком длинный пароль: русская буква считается за 2 символа';
          } else if (errorTexts[field]) {
            newErrors[field] = errorTexts[field];
          }
        }
        if (Object.keys(newErrors).length === 0) {
          setErrors({ form: 'Проверьте введённые данные' });
        } else {
          setErrors(newErrors);
        }
      } else {
        setErrors({ form: 'Проверьте введённые данные' });
      }
    } catch {
      setErrors({ form: 'Сервер недоступен, попробуйте позже' });
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthLayout>
      <h1>Регистрация</h1>
      {errors.form && <Alert title={errors.form} />}
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Фамилия Имя"
          placeholder="Иванов Иван"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
          autoComplete="name"
        />
        <Input
          label="Email"
          placeholder="you@example.com"
          type="email"
          error={errors.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          label="Пароль"
          placeholder="••••••••"
          type="password"
          error={errors.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />
        <Button disabled={loading}>Зарегистрироваться</Button>
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

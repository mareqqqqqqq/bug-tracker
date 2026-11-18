import Button from '../components/Button/Button.jsx';
import Input from '../components/Input/Input.jsx';

function LoginPage() {
  return (
    <>
      <h1>LoginPage</h1>
      <Input
        label="Почта"
        error="Обязательное поле"
        placeholder="Введите почту"
      />
    </>
  );
}
export default LoginPage;

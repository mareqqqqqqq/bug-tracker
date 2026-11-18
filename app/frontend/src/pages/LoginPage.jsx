import Button from '../components/Button/Button.jsx';

function LoginPage() {
  return (
    <>
      <h1>LoginPage</h1> <Button>Войти</Button> <Button disabled>Войти</Button>{' '}
      <Button variant="secondary">Войти</Button>{' '}
      <Button variant="secondary" disabled>
        Войти
      </Button>
    </>
  );
}
export default LoginPage;

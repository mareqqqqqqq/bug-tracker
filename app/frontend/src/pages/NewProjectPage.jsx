import { useState } from 'react';
import { useNavigate } from 'react-router';
import Alert from '../components/Alert/Alert';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Textarea from '../components/Textarea/Textarea';
import styles from './NewProjectPage.module.css';

const fields = ['name', 'description', 'repo_url'];

function getErrorText(item) {
  if (item.type === 'value_error') {
    return item.msg.replace('Value error, ', '');
  }
  if (item.type === 'string_too_short') {
    return 'Заполните поле';
  }
  if (item.type === 'string_too_long') {
    return `Не длиннее ${item.ctx.max_length} символов`;
  }
  return 'Неверное значение';
}

function NewProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: description || null,
          repo_url: repoUrl,
        }),
      });

      if (response.ok) {
        navigate('/projects');
        return;
      }
      if (response.status === 401) {
        navigate('/login');
        return;
      }
      if (response.status >= 500) {
        setErrors({ form: 'Ошибка на сервере, попробуйте позже' });
        return;
      }

      const data = await response.json();

      if (response.status === 422) {
        const newErrors = {};
        for (const item of data.detail) {
          const field = item.loc[1];
          if (fields.includes(field)) {
            newErrors[field] = getErrorText(item);
          }
        }
        newErrors.form = 'Проверьте отмеченные поля';
        setErrors(newErrors);
      } else {
        setErrors({ form: 'Не удалось создать проект' });
      }
    } catch {
      setErrors({ form: 'Сервер недоступен, попробуйте позже' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <Breadcrumbs
        items={[
          { label: 'Проекты', to: '/projects' },
          { label: 'Новый проект' },
        ]}
      />
      <h1>Новый проект</h1>
      <p className={`${styles.hint} text-s`}>Поля со звездочкой обязательны</p>

      {errors.form && (
        <Alert title={errors.form}>
          {errors.form === 'Проверьте отмеченные поля' &&
            'Исправьте их и нажмите «Создать» еще раз'}
        </Alert>
      )}

      <form className={styles.card} onSubmit={handleSubmit}>
        <Input
          label="Название *"
          placeholder="Как называется проект"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
        />
        <Textarea
          label="Описание"
          placeholder="Коротко о проекте"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          error={errors.description}
        />
        <Input
          label="Ссылка на репозиторий *"
          placeholder="https://github.com/..."
          value={repoUrl}
          onChange={(event) => setRepoUrl(event.target.value)}
          error={errors.repo_url}
        />
        <div className={styles.actions}>
          <Button disabled={loading}>Создать</Button>
        </div>
      </form>
    </main>
  );
}

export default NewProjectPage;

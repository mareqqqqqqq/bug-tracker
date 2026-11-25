import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs.jsx';
import Button from '../components/Button/Button.jsx';
import { roleNames } from '../constants/roles.js';
import styles from './ProjectPage.module.css';
import Alert from '../components/Alert/Alert.jsx';
import Input from '../components/Input/Input.jsx';
import Select from '../components/Select/Select.jsx';

const roleOptions = [
  { value: 'developer', label: 'Разработчик' },
  { value: 'tester', label: 'Тестировщик' },
  { value: 'lead', label: 'Тимлид' },
];

const mockProject = {
  id: 1,
  name: 'Интернет-магазин',
  description:
    'Онлайн-магазин бытовой техники: каталог корзина оформление заказа.',
  repo_url: 'https://github.com/team4/shop',
  my_role: 'lead',
};

function ProjectPage() {
  const { projectId } = useParams();
  const { user, setRole } = useOutletContext();
  const navigate = useNavigate();
  const [project] = useState(mockProject);
  const [members, setMembers] = useState(() => [
    { user_id: user.id, name: user.name, email: user.email, role: 'lead' },
    {
      user_id: 1001,
      name: 'Мария Петрова',
      email: 'petrova@mail.ru',
      role: 'developer',
    },
    {
      user_id: 1002,
      name: 'Олег Смирнов',
      email: 'smirnov@mail.ru',
      role: 'tester',
    },
  ]);

  const isLead = project.my_role === 'lead';

  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [adding, setAdding] = useState(false);
  const [addedId, setAddedId] = useState(null);

  async function handleAddMember(event) {
    event.preventDefault();
    setFormErrors({});
    setAdding(true);

    try {
      const response = await fetch(`/api/v1/projects/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: memberRole }),
      });

      if (response.ok) {
        const member = await response.json();
        setMembers([...members, member]);
        setAddedId(member.user_id);
        setShowForm(false);
        setEmail('');
        setMemberRole('');
        return;
      }
      if (response.status >= 500) {
        setFormErrors({ form: 'Ошибка на сервере, попробуйте позже' });
        return;
      }

      const data = await response.json();

      if (response.status === 409) {
        setFormErrors({ conflict: true });
      } else if (
        response.status === 404 &&
        data.detail === 'Пользователь с такой почтой не найден'
      ) {
        setFormErrors({ email: 'Пользователь не найден' });
      } else if (response.status === 422) {
        const newErrors = {};
        for (const item of data.detail) {
          if (item.loc[1] === 'email') {
            newErrors.email = 'Неверный формат email';
          }
          if (item.loc[1] === 'role') {
            newErrors.role = 'Выберите роль';
          }
        }
        setFormErrors(newErrors);
      } else {
        setFormErrors({ form: data.detail || 'Не удалось добавить участника' });
      }
    } catch {
      setFormErrors({ form: 'Сервер недоступен, попробуйте позже' });
    } finally {
      setAdding(false);
    }
  }

  useEffect(() => {
    setRole(project.my_role);
    return () => setRole(null);
  }, [project, setRole]);

  return (
    <main className={styles.page}>
      <Breadcrumbs
        items={[{ label: 'Проекты', to: '/projects' }, { label: project.name }]}
      />

      <div className={styles.top}>
        <h1>{project.name}</h1>
        <Button onClick={() => navigate(`/projects/${projectId}/bugs`)}>
          Перейти к багам
        </Button>
      </div>

      <section className={styles.info}>
        <div className={styles.infoBlock}>
          <p className="text-m-med">Описание</p>
          <p className={`${styles.description} text-m`}>
            {project.description || 'Описание не заполнено'}
          </p>
        </div>
        <div className={styles.infoBlock}>
          <p className="text-m-med">Репозиторий</p>
          <a
            href={project.repo_url}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {project.repo_url}
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionTop}>
          <h2>Участники ({members.length})</h2>
          {isLead && !showForm && (
            <Button variant="secondary" onClick={() => setShowForm(true)}>
              Добавить участника
            </Button>
          )}
        </div>
        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Участник</th>
                <th>Email</th>
                <th>Роль</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.user_id}
                  className={member.user_id === addedId ? styles.added : ''}
                >
                  <td>
                    {member.name}
                    {member.user_id === user.id && ' (вы)'}
                  </td>
                  <td>{member.email}</td>
                  <td className={styles.role}>{roleNames[member.role]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {formErrors.conflict && (
          <Alert title="Уже участник">
            Пользователь с этим email уже есть в проекте
          </Alert>
        )}
        {formErrors.form && <Alert title={formErrors.form} />}

        {showForm && (
          <form className={styles.addForm} onSubmit={handleAddMember}>
            <p className="text-h3">Добавить участника</p>
            <div className={styles.addRow}>
              <div className={styles.emailField}>
                <Input
                  label="Email"
                  placeholder="Email участника"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  error={formErrors.email}
                />
              </div>
              <div className={styles.roleField}>
                <Select
                  label="Роль"
                  placeholder="Выберите роль"
                  options={roleOptions}
                  value={memberRole}
                  onChange={(event) => setMemberRole(event.target.value)}
                  error={formErrors.role}
                />
              </div>
              <div className={styles.addButton}>
                <Button disabled={adding}>Добавить</Button>
              </div>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default ProjectPage;

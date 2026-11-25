import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs.jsx';
import Button from '../components/Button/Button.jsx';
import { roleNames } from '../constants/roles.js';
import styles from './ProjectPage.module.css';

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
  const [members] = useState(() => [
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
          {isLead && <Button variant="secondary">Добавить участника</Button>}
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
                <tr key={member.user_id}>
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
      </section>
    </main>
  );
}

export default ProjectPage;

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Button from '../components/Button/Button.jsx';
import Alert from '../components/Alert/Alert.jsx';
import styles from './ProjectsPage.module.css';
import { roleNames } from '../constants/roles.js';

function ProjectsPage() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function loadProjects() {
      try {
        const response = await fetch('/api/v1/projects', {
          signal: controller.signal,
        });
        if (!response.ok) {
          setError('Не удалось загрузить проекты');
          return;
        }
        setProjects(await response.json());
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setError('Сервер недоступен, попробуйте позже');
      }
    }

    loadProjects();
    return () => controller.abort();
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <h1>Мои проекты</h1>
        <Button onClick={() => navigate('/projects/new')}>
          + Добавить проект
        </Button>
      </div>

      {error && <Alert title={error} />}

      {projects && projects.length === 0 && (
        <p className={styles.empty}>У вас пока нет проектов</p>
      )}

      {projects && projects.length > 0 && (
        <div className={styles.card}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Название</th>
                <th>Моя роль</th>
                <th>Открытых багов</th>
                <th>Участников</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link
                      to={`/projects/${project.id}`}
                      className={styles.link}
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td>{roleNames[project.my_role]}</td>
                  <td>{project.open_bugs_count}</td>
                  <td>{project.members_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default ProjectsPage;

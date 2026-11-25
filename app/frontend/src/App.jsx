import { Routes, Route, Navigate } from 'react-router';
import LoginPage from './pages/LoginPage';
import BugListPage from './pages/BugListPage';
import BugPage from './pages/BugPage';
import NewBugPage from './pages/NewBugPage';
import NewProjectPage from './pages/NewProjectPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjectPage from './pages/ProjectPage';
import ProjectsPage from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedLayout from './components/ProtectedLayout/ProtectedLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/projects/:projectId/bugs" element={<BugListPage />} />
        <Route path="/projects/:projectId/bugs/:bugId" element={<BugPage />} />
        <Route path="/projects/:projectId/bugs/new" element={<NewBugPage />} />
        <Route path="/projects/new" element={<NewProjectPage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

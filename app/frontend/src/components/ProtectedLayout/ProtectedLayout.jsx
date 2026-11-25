import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import Header from '../Header/Header.jsx';

function ProtectedLayout() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [role, setRole] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function checkAuth() {
      try {
        let response = await fetch('/api/v1/auth/me', {
          signal: controller.signal,
        });
        if (!response.ok) {
          response = await fetch('/api/v1/auth/refresh', {
            method: 'POST',
            signal: controller.signal,
          });
        }
        if (response.ok) {
          setUser(await response.json());
          setStatus('ok');
        } else {
          setStatus('guest');
        }
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setStatus('guest');
      }
    }

    checkAuth();
    return () => controller.abort();
  }, []);

  if (status === 'loading') {
    return null;
  }
  if (status === 'guest') {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Header user={user} role={role} />
      <Outlet context={{ user, setRole }} />
    </>
  );
}

export default ProtectedLayout;

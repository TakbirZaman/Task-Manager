// frontend/src/components/Navbar.jsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold text-forest">Task Manager</span>
          <span className="font-mono text-xs text-ink-muted">/ tasks</span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden font-sans text-sm text-ink-muted sm:inline">{user.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink transition hover:border-brick hover:text-brick"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

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
    <header className="glass-strong sticky top-0 z-50 border-b border-aurora/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 animate-fade-in-up">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurora-gradient">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-display text-xl font-bold text-gradient">Taskflow</span>
        </div>

        {user && (
          <div className="flex items-center gap-4 animate-fade-in-up delay-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-aurora/20 text-xs font-semibold text-aurora-light">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-silver sm:inline">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="group rounded-lg border border-mist/50 px-3 py-1.5 text-sm font-medium text-ghost transition-all duration-300 hover:border-rose/50 hover:text-rose hover:shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

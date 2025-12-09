import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function Router({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within Router');
  }
  return context;
}

export function useNavigate() {
  const { navigate } = useRouter();
  return navigate;
}

export function Route({ path, component: Component }: { path: string; component: () => JSX.Element }) {
  const { currentPath } = useRouter();
  return currentPath === path ? <Component /> : null;
}

export function Link({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
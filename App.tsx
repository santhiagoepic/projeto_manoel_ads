
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { INITIAL_DATA } from './constants';
import { LandingPageData } from './types';
import { apiUrl } from './clientApi';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [data, setData] = useState<LandingPageData>(INITIAL_DATA);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Estado de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('legal_landing_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        setData(INITIAL_DATA);
      }
    }

    (async () => {
      try {
        const res = await fetch(apiUrl('/api/landing-data'));
        if (res.ok) {
          const payload = (await res.json()) as { data: LandingPageData };
          setData(payload.data);
        }
      } finally {
        setDataLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setIsAuthenticated(false);
      localStorage.removeItem('is_admin_authenticated');
      return;
    }

    (async () => {
      try {
        const res = await fetch(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ok = res.ok;
        setIsAuthenticated(ok);
        if (ok) localStorage.setItem('is_admin_authenticated', 'true');
        else localStorage.removeItem('is_admin_authenticated');
      } catch {
        setIsAuthenticated(false);
        localStorage.removeItem('is_admin_authenticated');
      }
    })();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('legal_landing_data', JSON.stringify(data));
    } catch {
      // Evita "tela branca" em caso de QuotaExceededError (imagens base64 podem estourar o limite)
    }

    if (!dataLoaded) return;
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const controller = new AbortController();
    const t = setTimeout(() => {
      fetch(apiUrl('/api/landing-data'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
        signal: controller.signal,
      }).catch(() => undefined);
    }, 500);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [data, dataLoaded]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('is_admin_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_admin_authenticated');
    localStorage.removeItem('auth_token');
  };

  const handleReset = () => {
    if (confirm("Deseja realmente resetar todas as alterações para o padrão?")) {
      localStorage.removeItem('legal_landing_data');
      const token = localStorage.getItem('auth_token');
      if (token) {
        fetch(apiUrl('/api/landing-data/reset'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(async (r) => {
            if (!r.ok) throw new Error('reset_failed');
            const res = await fetch(apiUrl('/api/landing-data'));
            if (res.ok) {
              const payload = (await res.json()) as { data: LandingPageData };
              setData(payload.data);
            } else {
              setData(INITIAL_DATA);
            }
          })
          .catch(() => setData(INITIAL_DATA));
      } else {
        setData(INITIAL_DATA);
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage data={data} />} />
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/admin" /> : <LoginPage onLogin={handleLogin} />} 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AdminPage data={data} onUpdate={setData} onReset={handleReset} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <Footer data={data} />
      </div>
    </Router>
  );
};

const Navigation: React.FC<{ isAuthenticated: boolean; onLogout: () => void }> = ({ isAuthenticated, onLogout }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';
  const isLoginRoute = location.pathname === '/login';
  const isLandingRoute = location.pathname === '/';

  // Não mostrar navegação completa na tela de login
  if (isLoginRoute || isLandingRoute) return null;

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-[60] border-b border-gray-100 py-3 px-6 h-20 flex items-center">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4 group hover:opacity-90 transition-opacity">
           {/* Logo SVG */}
           <div className="h-12 w-16 relative">
            <img src="/logos/logo cor principal sem fundo.svg" alt="Logo Manoel Neto" className="w-full h-full object-contain" />
           </div>
           {/* Text Block removido conforme solicitado */}
        </Link>
        
        <div className="flex gap-3">
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              {isAdminRoute ? (
                <Link 
                  to="/" 
                  className="text-xs font-bold px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all shadow-md shadow-green-200"
                >
                  SALVAR E SAIR
                </Link>
              ) : (
                <Link 
                  to="/admin" 
                  className="text-xs font-bold px-4 py-2 rounded-lg bg-[#003B46] text-white hover:bg-[#00252D] transition-all"
                >
                  PAINEL ADMIN
                </Link>
              )}
              <button 
                onClick={onLogout}
                className="text-xs font-bold px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all"
              >
                SAIR
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC<{ data: LandingPageData }> = ({ data }) => {
  const location = useLocation();
  // Esconder footer no admin e login para foco total
  if (location.pathname === '/admin' || location.pathname === '/login') return null;

  return (
    <footer className="bg-[#00252D] text-white py-12 px-6 border-t border-[#003B46]">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <p className="text-sm font-medium uppercase tracking-wider text-white/80">
          {data.about.title} © TODOS OS DIREITOS RESERVADOS
        </p>
        <p className="text-[10px] text-white/40 max-w-2xl mx-auto italic">
          Trabalhamos exclusivamente com serviços jurídicos especializados.
        </p>
      </div>
    </footer>
  );
};

export default App;

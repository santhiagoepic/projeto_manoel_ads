
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  onLogin: () => void;
}

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('Credenciais inválidas. Tente novamente.');
        return;
      }

      const payload = (await res.json()) as { token: string };
      localStorage.setItem('auth_token', payload.token);
      onLogin();
      navigate('/admin');
    } catch {
      setError('Não foi possível conectar ao servidor local.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-[#003B46] p-8 text-center flex flex-col items-center">
          {/* Novo Logo Completo em Branco para Login */}
          <div className="flex flex-col items-center">
            <div className="h-20 w-28 relative">
              <img src="/logos/logo vertical branca sem fundo.svg" alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-900 outline-none focus:border-[#003B46] focus:bg-white transition-all font-medium"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-900 outline-none focus:border-[#003B46] focus:bg-white transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#003B46] hover:bg-[#00252D] disabled:opacity-60 disabled:cursor-not-allowed text-white font-black rounded-xl uppercase tracking-widest shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm"
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
           <p className="text-[10px] text-gray-400">Protegido por criptografia de ponta a ponta.</p>
        </div>
      </div>
    </div>
  );
};

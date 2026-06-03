import { useState, useEffect, createContext, useContext } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('haett_token');
    if (!token) { setUser(null); setLoading(false); return; }
    api.me()
      .then(({ user }) => setUser(user))
      .catch(() => { localStorage.removeItem('haett_token'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { token, user } = await api.login(email, password);
    localStorage.setItem('haett_token', token);
    setUser(user);
    return user;
  }

  async function register(email, password, name) {
    const { token, user } = await api.register(email, password, name);
    localStorage.setItem('haett_token', token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem('haett_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

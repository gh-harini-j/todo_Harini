import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => localStorage.getItem('username'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (username, token) => {
    setUser(username);
    setToken(token);
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    setUser(localStorage.getItem('username'));
    setToken(localStorage.getItem('token'));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
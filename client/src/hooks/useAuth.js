import { useState } from 'react';
import { getErrorMessage, loginRequest } from '../api.js';

const USER_KEY = 'metadata-user';

function readUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(readUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login(email, password) {
    setLoading(true);
    setError('');
    try {
      const { data } = await loginRequest(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.data));
      setToken(data.token);
      setUser(data.data);
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  return { token, user, loading, error, login, logout };
}

import { useState } from 'react';

function LoginForm({ onLogin, loading, error }) {
  const [email, setEmail] = useState('user@metadata.local');
  const [password, setPassword] = useState('user123');

  async function handleSubmit(event) {
    event.preventDefault();
    await onLogin(email, password);
  }

  return (
    <aside className="card form-card login-card">
      <h2>Вход</h2>
      <p className="hint">
        JWT обязателен: без токена API документов недоступен.
        Демо: user@metadata.local / user123 или admin@metadata.local / admin123
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Вход…' : 'Войти'}
          </button>
        </div>
      </form>
    </aside>
  );
}

export default LoginForm;

import './App.css';
import DocumentEditor from './components/DocumentEditor.jsx';
import DocumentList from './components/DocumentList.jsx';
import DocumentStats from './components/DocumentStats.jsx';
import LoginForm from './components/LoginForm.jsx';
import Notification from './components/Notification.jsx';
import { useAuth } from './hooks/useAuth.js';
import { useDocumentsLogic } from './hooks/useDocumentsLogic.js';

function App() {
  const { token, user, loading: authLoading, error: authError, login, logout } = useAuth();
  const {
    visible,
    stats,
    loading,
    error,
    attempt,
    loadDocuments,
    filterType,
    setFilterType,
    notice,
    noticeTone,
    setNotice,
    handleSubmit,
    handleRemove,
    form,
    editingId,
    handleChange,
    resetForm,
    startEdit
  } = useDocumentsLogic(Boolean(token));

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="logo" aria-hidden="true">MS</span>
          <div>
            <strong>Metadata Service</strong>
            <p>Каталог документов и метаданных</p>
          </div>
        </div>
        {user ? (
          <div className="top-actions">
            <span className="chip">{user.email}</span>
            <button type="button" className="secondary" onClick={logout}>
              Выйти
            </button>
          </div>
        ) : null}
      </header>

      <main className="app">
        {!token ? (
          <LoginForm onLogin={login} loading={authLoading} error={authError} />
        ) : (
          <>
            <Notification
              message={notice}
              tone={noticeTone}
              onClose={() => setNotice('')}
            />

            {loading && (
              <div className="banner">
                <span className="spinner" aria-hidden="true" />
                Загрузка документов
                {attempt > 1 ? ` · повтор ${attempt} из 3` : '…'}
              </div>
            )}

            {error && !loading && (
              <div className="banner banner-error">
                <p>{error}</p>
                <button type="button" onClick={loadDocuments}>Повторить</button>
              </div>
            )}

            <section className="layout">
              <DocumentEditor
                form={form}
                editingId={editingId}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={resetForm}
              />

              <div className="stack">
                <DocumentStats stats={stats} />
                <DocumentList
                  visible={visible}
                  filterType={filterType}
                  onFilterChange={setFilterType}
                  onEdit={startEdit}
                  onDelete={handleRemove}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;

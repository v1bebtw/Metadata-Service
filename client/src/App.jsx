import './App.css';
import DocumentEditor from './components/DocumentEditor.jsx';
import DocumentList from './components/DocumentList.jsx';
import DocumentStats from './components/DocumentStats.jsx';
import Notification from './components/Notification.jsx';
import { useDocumentsLogic } from './hooks/useDocumentsLogic.js';

function App() {
  const {
    visible,
    stats,
    filterType,
    setFilterType,
    notice,
    setNotice,
    handleSubmit,
    handleRemove,
    form,
    editingId,
    handleChange,
    resetForm,
    startEdit
  } = useDocumentsLogic();

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
        <span className="chip">Lab 4 · React</span>
      </header>

      <main className="app">
        <Notification message={notice} onClose={() => setNotice('')} />

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
      </main>
    </div>
  );
}

export default App;

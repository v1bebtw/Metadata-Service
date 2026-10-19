import { STATUS_LABEL, STATUSES, TYPES } from '../constants.js';

function DocumentEditor({
  form,
  editingId,
  onChange,
  onSubmit,
  onCancel
}) {
  return (
    <aside className="card form-card">
      <h2>{editingId !== null ? 'Редактирование' : 'Новый документ'}</h2>
      <p className="hint">Данные остаются в браузере после перезагрузки.</p>

      <form onSubmit={onSubmit}>
        <label>
          Имя файла
          <input
            name="fileName"
            value={form.fileName}
            onChange={onChange}
            placeholder="report.pdf"
            required
          />
        </label>

        <label>
          Тип
          <select name="fileType" value={form.fileType} onChange={onChange}>
            {TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label>
          Размер (байт)
          <input
            name="fileSizeBytes"
            type="number"
            min="0"
            value={form.fileSizeBytes}
            onChange={onChange}
            placeholder="1048576"
          />
        </label>

        <label>
          Статус
          <select name="status" value={form.status} onChange={onChange}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{STATUS_LABEL[status]}</option>
            ))}
          </select>
        </label>

        <label>
          Автор
          <input
            name="author"
            value={form.author}
            onChange={onChange}
            placeholder="Иванов И.И."
          />
        </label>

        <div className="actions">
          <button type="submit">
            {editingId !== null ? 'Сохранить' : 'Добавить в каталог'}
          </button>
          {editingId !== null && (
            <button type="button" className="secondary" onClick={onCancel}>
              Отмена
            </button>
          )}
        </div>
      </form>
    </aside>
  );
}

export default DocumentEditor;

function DocumentActions({ onEdit, onDelete }) {
  return (
    <div className="row-actions">
      <button type="button" className="secondary" onClick={onEdit}>
        Изменить
      </button>
      <button type="button" className="danger" onClick={onDelete}>
        Удалить
      </button>
    </div>
  );
}

export default DocumentActions;

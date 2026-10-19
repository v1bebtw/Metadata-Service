import DocumentCard from './DocumentCard.jsx';
import DocumentSearch from './DocumentSearch.jsx';

function DocumentList({ visible, filterType, onFilterChange, onEdit, onDelete }) {
  return (
    <div className="card list-card">
      <div className="toolbar">
        <h2>Каталог</h2>
        <DocumentSearch filterType={filterType} onFilterChange={onFilterChange} />
      </div>

      {visible.length === 0 ? (
        <p className="empty">Нет документов для выбранного фильтра.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Файл</th>
              <th>Тип</th>
              <th>Статус</th>
              <th>Размер</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DocumentList;

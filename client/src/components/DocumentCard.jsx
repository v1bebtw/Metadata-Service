import { STATUS_LABEL, formatSize } from '../constants.js';
import DocumentActions from './DocumentActions.jsx';

function DocumentCard({ doc, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <strong>{doc.fileName}</strong>
        {doc.author ? <span className="meta">{doc.author}</span> : null}
      </td>
      <td>
        <span className={`badge badge-${doc.fileType}`}>{doc.fileType}</span>
      </td>
      <td>{STATUS_LABEL[doc.status] || doc.status}</td>
      <td>{formatSize(doc.fileSizeBytes)}</td>
      <td>
        <DocumentActions
          onEdit={() => onEdit(doc)}
          onDelete={() => onDelete(doc.id)}
        />
      </td>
    </tr>
  );
}

export default DocumentCard;

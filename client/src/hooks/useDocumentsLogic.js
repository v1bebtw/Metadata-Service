import { useEffect, useState } from 'react';
import { useDocuments } from './useDocuments.js';
import { useDocumentForm } from './useDocumentForm.js';
import { useDocumentFilter } from './useDocumentFilter.js';

export function useDocumentsLogic() {
  const { documents, addDocument, updateDocument, removeDocument } = useDocuments();
  const formState = useDocumentForm();
  const { filterType, setFilterType, visible } = useDocumentFilter(documents);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.title = `Документы (${documents.length})`;
    return () => {
      document.title = 'Metadata Service';
    };
  }, [documents.length]);

  const stats = {
    total: documents.length,
    pdf: documents.filter((d) => d.fileType === 'pdf').length,
    docx: documents.filter((d) => d.fileType === 'docx').length,
    image: documents.filter((d) => d.fileType === 'image').length
  };

  function handleSubmit(event) {
    event.preventDefault();
    const payload = formState.toPayload();
    if (!payload.fileName) return;

    if (formState.editingId !== null) {
      updateDocument(formState.editingId, payload);
      setNotice('Документ обновлён');
    } else {
      addDocument(payload);
      setNotice('Документ добавлен');
    }

    formState.resetForm();
  }

  function handleRemove(id) {
    removeDocument(id);
    if (formState.editingId === id) formState.resetForm();
    setNotice('Документ удалён');
  }

  return {
    documents,
    visible,
    stats,
    filterType,
    setFilterType,
    notice,
    setNotice,
    handleSubmit,
    handleRemove,
    ...formState
  };
}

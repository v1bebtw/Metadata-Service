import { useEffect, useState } from 'react';
import { useDocuments } from './useDocuments.js';
import { useDocumentForm } from './useDocumentForm.js';
import { useDocumentFilter } from './useDocumentFilter.js';

export function useDocumentsLogic(enabled) {
  const {
    documents,
    loading,
    error,
    attempt,
    loadDocuments,
    addDocument,
    updateDocument,
    removeDocument
  } = useDocuments(enabled);
  const formState = useDocumentForm();
  const { filterType, setFilterType, visible } = useDocumentFilter(documents);
  const [notice, setNotice] = useState('');
  const [noticeTone, setNoticeTone] = useState('ok');

  useEffect(() => {
    document.title = enabled ? `Документы (${documents.length})` : 'Metadata Service';
    return () => {
      document.title = 'Metadata Service';
    };
  }, [documents.length, enabled]);

  const stats = {
    total: documents.length,
    pdf: documents.filter((d) => d.fileType === 'pdf').length,
    docx: documents.filter((d) => d.fileType === 'docx').length,
    image: documents.filter((d) => d.fileType === 'image').length
  };

  function showNotice(message, tone = 'ok') {
    setNoticeTone(tone);
    setNotice(message);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = formState.toPayload();
    if (!payload.fileName) return;

    if (formState.editingId !== null) {
      const result = await updateDocument(formState.editingId, payload);
      if (!result.ok) {
        showNotice(result.error, 'error');
        return;
      }
      showNotice('Документ обновлён');
    } else {
      const result = await addDocument(payload);
      if (!result.ok) {
        showNotice(result.error, 'error');
        return;
      }
      showNotice('Документ добавлен');
    }

    formState.resetForm();
  }

  async function handleRemove(id) {
    const result = await removeDocument(id);
    if (!result.ok) {
      showNotice(result.error, 'error');
      return;
    }
    if (formState.editingId === id) formState.resetForm();
    showNotice('Документ удалён');
  }

  return {
    documents,
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
    ...formState
  };
}

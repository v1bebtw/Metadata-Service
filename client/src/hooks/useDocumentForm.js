import { useState } from 'react';
import { EMPTY_FORM } from '../constants.js';

export function useDocumentForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEdit(doc) {
    setEditingId(doc.id);
    setForm({
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSizeBytes: String(doc.fileSizeBytes ?? ''),
      status: doc.status,
      author: doc.author || ''
    });
  }

  function toPayload() {
    return {
      fileName: form.fileName.trim(),
      fileType: form.fileType,
      fileSizeBytes: Number(form.fileSizeBytes) || 0,
      status: form.status,
      author: form.author.trim()
    };
  }

  return { form, editingId, handleChange, resetForm, startEdit, toPayload };
}

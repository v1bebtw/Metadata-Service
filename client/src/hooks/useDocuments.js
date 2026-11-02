import { useCallback, useEffect, useRef, useState } from 'react';
import {
  addDocumentRequest,
  deleteDocumentRequest,
  fetchDocumentsWithRetry,
  getErrorMessage,
  updateDocumentRequest
} from '../api.js';

function normalize(doc) {
  return {
    id: doc.id,
    fileName: doc.fileName,
    fileType: doc.fileType,
    fileSizeBytes: doc.fileSizeBytes,
    status: doc.status,
    author: doc.metadata?.author || '',
    metadata: doc.metadata || {}
  };
}

function toServer(payload) {
  return {
    fileName: payload.fileName,
    fileType: payload.fileType,
    fileSizeBytes: Number(payload.fileSizeBytes) || 0,
    status: payload.status,
    metadata: { author: payload.author || '' }
  };
}

export function useDocuments(enabled) {
  const [documents, setDocuments] = useState([]);
  const documentsRef = useRef(documents);
  documentsRef.current = documents;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const loadDocuments = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError('');
    setAttempt(0);
    try {
      const { data } = await fetchDocumentsWithRetry((current) => {
        setAttempt(current);
      });
      setDocuments((data.data || []).map(normalize));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setDocuments([]);
      setError('');
      return undefined;
    }
    loadDocuments();
    return undefined;
  }, [enabled, loadDocuments]);

  async function addDocument(payload) {
    const tempId = Date.now();
    const optimistic = { id: tempId, ...payload };
    setDocuments((prev) => [...prev, optimistic]);
    try {
      const { data } = await addDocumentRequest(toServer(payload));
      const saved = normalize(data.data);
      setDocuments((prev) => prev.map((doc) => (doc.id === tempId ? saved : doc)));
      return { ok: true };
    } catch (err) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== tempId));
      return { ok: false, error: getErrorMessage(err) };
    }
  }

  async function updateDocument(id, payload) {
    const snapshot = documentsRef.current.find((doc) => doc.id === id);
    setDocuments((prev) => prev.map((doc) => (
      doc.id === id ? { ...doc, ...payload } : doc
    )));
    try {
      const { data } = await updateDocumentRequest(id, toServer(payload));
      const saved = normalize(data.data);
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? saved : doc)));
      return { ok: true };
    } catch (err) {
      if (snapshot) {
        setDocuments((prev) => prev.map((doc) => (doc.id === id ? snapshot : doc)));
      }
      return { ok: false, error: getErrorMessage(err) };
    }
  }

  async function removeDocument(id) {
    const snapshot = documentsRef.current.find((doc) => doc.id === id);
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    try {
      await deleteDocumentRequest(id);
      return { ok: true };
    } catch (err) {
      if (snapshot) {
        setDocuments((prev) => [...prev, snapshot].sort((a, b) => a.id - b.id));
      }
      return { ok: false, error: getErrorMessage(err) };
    }
  }

  return {
    documents,
    loading,
    error,
    attempt,
    loadDocuments,
    addDocument,
    updateDocument,
    removeDocument
  };
}

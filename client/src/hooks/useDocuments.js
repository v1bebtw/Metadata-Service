import { INITIAL_DOCUMENTS, STORAGE_KEY } from '../constants.js';
import { useLocalStorage } from './useLocalStorage.js';

export function useDocuments() {
  const [documents, setDocuments] = useLocalStorage(STORAGE_KEY, INITIAL_DOCUMENTS);

  function addDocument(payload) {
    setDocuments((prev) => [...prev, { id: Date.now(), ...payload }]);
  }

  function updateDocument(id, payload) {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...payload } : doc)));
  }

  function removeDocument(id) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }

  return { documents, addDocument, updateDocument, removeDocument };
}

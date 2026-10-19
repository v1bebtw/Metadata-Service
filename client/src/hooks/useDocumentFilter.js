import { useState } from 'react';

export function useDocumentFilter(documents) {
  const [filterType, setFilterType] = useState('all');

  const visible = documents.filter(
    (doc) => filterType === 'all' || doc.fileType === filterType
  );

  return { filterType, setFilterType, visible };
}

export const STORAGE_KEY = 'metadata-documents';
export const TYPES = ['pdf', 'docx', 'image'];
export const STATUSES = ['uploaded', 'processing', 'ready'];

export const STATUS_LABEL = {
  uploaded: 'загружен',
  processing: 'обработка',
  ready: 'готов'
};

export const INITIAL_DOCUMENTS = [
  {
    id: 1,
    fileName: 'diploma_draft.docx',
    fileType: 'docx',
    fileSizeBytes: 245000,
    status: 'uploaded',
    author: 'Студент'
  },
  {
    id: 2,
    fileName: 'photo_scan.png',
    fileType: 'image',
    fileSizeBytes: 1850000,
    status: 'ready',
    author: ''
  },
  {
    id: 3,
    fileName: 'analytics_report.pdf',
    fileType: 'pdf',
    fileSizeBytes: 1048576,
    status: 'processing',
    author: 'Иванов И.И.'
  }
];

export const EMPTY_FORM = {
  fileName: '',
  fileType: 'pdf',
  fileSizeBytes: '',
  status: 'uploaded',
  author: ''
};

export function formatSize(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} Б`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} КБ`;
  return `${(n / (1024 * 1024)).toFixed(2)} МБ`;
}

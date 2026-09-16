const express = require('express');
const app = express();
const PORT = 3000;

// Middleware для парсинга JSON и URL-encoded тел запросов
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Временное хранилище метаданных (в памяти сервера)
let documents = [
  {
    id: 1,
    fileName: "diploma_draft.docx",
    fileType: "docx",
    fileSizeBytes: 245000,
    uploadDate: new Date().toISOString(),
    metadata: {
      author: "Студент",
      pages: 45,
      software: "Microsoft Office Word"
    }
  },
  {
    id: 2,
    fileName: "photo_scan.png",
    fileType: "image",
    fileSizeBytes: 1850000,
    uploadDate: new Date().toISOString(),
    metadata: {
      resolution: "1920x1080",
      colorDepth: "24-bit"
    }
  }
];

let nextId = 3;

// ================= РОУТЫ (CRUD) =================

// 1. GET /api/documents — Все документы
app.get('/api/documents', (req, res) => {
  res.status(200).json({
    success: true,
    count: documents.length,
    data: documents
  });
});

// 2. GET /api/documents/:id — Документ по ID
app.get('/api/documents/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const doc = documents.find(d => d.id === id);

  if (!doc) {
    return res.status(404).json({
      success: false,
      error: `Документ с ID ${id} не найден`
    });
  }

  res.status(200).json({
    success: true,
    data: doc
  });
});

// 3. POST /api/documents — Добавить документ
app.post('/api/documents', (req, res) => {
  const { fileName, fileType, fileSizeBytes, metadata } = req.body;

  // Валидация входных данных (ошибка 400)
  if (!fileName || !fileType) {
    return res.status(400).json({
      success: false,
      error: "Поля 'fileName' и 'fileType' обязательны!"
    });
  }

  const allowedTypes = ['pdf', 'docx', 'image'];
  if (!allowedTypes.includes(fileType.toLowerCase())) {
    return res.status(400).json({
      success: false,
      error: `Недопустимый формат файла. Разрешены: ${allowedTypes.join(', ')}`
    });
  }

  const newDoc = {
    id: nextId++,
    fileName,
    fileType: fileType.toLowerCase(),
    fileSizeBytes: fileSizeBytes || 0,
    uploadDate: new Date().toISOString(),
    metadata: metadata || {}
  };

  documents.push(newDoc);

  res.status(201).json({
    success: true,
    data: newDoc
  });
});

// 4. PUT /api/documents/:id — Обновить документ
app.put('/api/documents/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const docIndex = documents.findIndex(d => d.id === id);

  if (docIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Документ с ID ${id} не найден`
    });
  }

  const { fileName, fileType, fileSizeBytes, metadata } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({
      success: false,
      error: "Поля 'fileName' и 'fileType' обязательны для обновления"
    });
  }

  documents[docIndex] = {
    id,
    fileName,
    fileType: fileType.toLowerCase(),
    fileSizeBytes: fileSizeBytes !== undefined ? fileSizeBytes : documents[docIndex].fileSizeBytes,
    uploadDate: documents[docIndex].uploadDate,
    metadata: metadata || {}
  };

  res.status(200).json({
    success: true,
    data: documents[docIndex]
  });
});

// 5. DELETE /api/documents/:id — Удалить документ
app.delete('/api/documents/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const docIndex = documents.findIndex(d => d.id === id);

  if (docIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Документ с ID ${id} не найден`
    });
  }

  const deleted = documents.splice(docIndex, 1);

  res.status(200).json({
    success: true,
    message: `Документ с ID ${id} удален`,
    data: deleted[0]
  });
});

// Тестовый маршрут для проверки глобального обработчика ошибок
app.get('/test-500', (req, res, next) => {
  next(new Error('Тестовая внутренняя ошибка сервера'));
});

// Ошибка 404 для неизвестных роутов
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
require('dotenv').config();

const express = require('express');
const { sequelize, Document } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_TYPES = ['pdf', 'docx', 'image'];
const ALLOWED_STATUSES = ['uploaded', 'processing', 'ready'];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function validateDocument(body) {
  const { fileName, fileType, status } = body;

  if (!fileName || !fileType) {
    return "Поля 'fileName' и 'fileType' обязательны!";
  }

  if (!ALLOWED_TYPES.includes(String(fileType).toLowerCase())) {
    return `Недопустимый формат файла. Разрешены: ${ALLOWED_TYPES.join(', ')}`;
  }

  if (status && !ALLOWED_STATUSES.includes(status)) {
    return `Недопустимый статус. Разрешены: ${ALLOWED_STATUSES.join(', ')}`;
  }

  return null;
}

function buildPayload(body) {
  return {
    fileName: body.fileName,
    fileType: String(body.fileType).toLowerCase(),
    fileSizeBytes: body.fileSizeBytes !== undefined ? body.fileSizeBytes : 0,
    uploadDate: body.uploadDate || new Date(),
    metadata: body.metadata || {},
    status: body.status || 'uploaded'
  };
}

// GET /api/documents — все документы
app.get('/api/documents', async (req, res, next) => {
  try {
    const documents = await Document.findAll({ order: [['id', 'ASC']] });
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/:id — документ по ID
app.get('/api/documents/:id', async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: `Документ с ID ${req.params.id} не найден`
      });
    }

    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// POST /api/documents — создать документ
app.post('/api/documents', async (req, res, next) => {
  try {
    const error = validateDocument(req.body);
    if (error) {
      return res.status(400).json({ success: false, error });
    }

    const doc = await Document.create(buildPayload(req.body));
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// PUT /api/documents/:id — полное обновление
app.put('/api/documents/:id', async (req, res, next) => {
  try {
    const error = validateDocument(req.body);
    if (error) {
      return res.status(400).json({ success: false, error });
    }

    const [updated] = await Document.update(buildPayload(req.body), {
      where: { id: req.params.id }
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: `Документ с ID ${req.params.id} не найден`
      });
    }

    const doc = await Document.findByPk(req.params.id);
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/documents/:id — удалить документ
app.delete('/api/documents/:id', async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: `Документ с ID ${req.params.id} не найден`
      });
    }

    await Document.destroy({ where: { id: req.params.id } });

    res.status(200).json({
      success: true,
      message: `Документ с ID ${req.params.id} удален`,
      data: doc
    });
  } catch (err) {
    next(err);
  }
});

app.get('/test-500', (req, res, next) => {
  next(new Error('Тестовая внутренняя ошибка сервера'));
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к PostgreSQL установлено');
    app.listen(PORT, () => {
      console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Не удалось подключиться к базе данных:', err.message);
    process.exit(1);
  }
}

start();

require('dotenv').config();

const express = require('express');
const { sequelize, Document, User } = require('./models');
const authRoutes = require('./routes/auth');
const { authenticate } = require('./middleware/auth');
const { isAdmin } = require('./middleware/isAdmin');

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_TYPES = ['pdf', 'docx', 'image'];
const ALLOWED_STATUSES = ['uploaded', 'processing', 'ready'];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

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

function canAccessDocument(user, doc) {
  return user.role === 'admin' || doc.userId === user.id;
}

app.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Пользователь не найден'
      });
    }

    res.status(200).json({
      success: true,
      data: user.toSafeJSON()
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/users', authenticate, isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'createdAt'],
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/documents', authenticate, async (req, res, next) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const documents = await Document.findAll({
      where,
      order: [['id', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/documents/:id', authenticate, async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: `Документ с ID ${req.params.id} не найден`
      });
    }

    if (!canAccessDocument(req.user, doc)) {
      return res.status(403).json({
        success: false,
        error: 'Нет доступа к этому документу'
      });
    }

    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

app.post('/api/documents', authenticate, async (req, res, next) => {
  try {
    const error = validateDocument(req.body);
    if (error) {
      return res.status(400).json({ success: false, error });
    }

    const doc = await Document.create({
      ...buildPayload(req.body),
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

app.put('/api/documents/:id', authenticate, async (req, res, next) => {
  try {
    const error = validateDocument(req.body);
    if (error) {
      return res.status(400).json({ success: false, error });
    }

    const doc = await Document.findByPk(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: `Документ с ID ${req.params.id} не найден`
      });
    }

    if (!canAccessDocument(req.user, doc)) {
      return res.status(403).json({
        success: false,
        error: 'Нет доступа к этому документу'
      });
    }

    await doc.update(buildPayload(req.body));
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

app.delete('/api/documents/:id', authenticate, async (req, res, next) => {
  try {
    const doc = await Document.findByPk(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: `Документ с ID ${req.params.id} не найден`
      });
    }

    if (!canAccessDocument(req.user, doc)) {
      return res.status(403).json({
        success: false,
        error: 'Нет доступа к этому документу'
      });
    }

    await doc.destroy();

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
    if (!process.env.JWT_SECRET) {
      throw new Error('Не задана переменная JWT_SECRET в .env');
    }

    await sequelize.authenticate();
    console.log('Подключение к PostgreSQL установлено');
    app.listen(PORT, () => {
      console.log(`Сервер запущен: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Не удалось запустить сервер:', err.message);
    process.exit(1);
  }
}

start();

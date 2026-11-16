const express = require('express');
const mongoose = require('mongoose');
const { MongoDocument, ALLOWED_TYPES, ALLOWED_STATUSES } = require('../mongo/document');

const router = express.Router();

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
  const payload = {
    fileName: body.fileName,
    fileType: String(body.fileType).toLowerCase(),
    fileSizeBytes: body.fileSizeBytes !== undefined ? body.fileSizeBytes : 0,
    uploadDate: body.uploadDate || new Date(),
    metadata: body.metadata || {},
    status: body.status || 'uploaded',
    authorEmail: body.authorEmail || ''
  };

  if (Array.isArray(body.history)) {
    payload.history = body.history;
  }

  return payload;
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.get('/', async (req, res, next) => {
  try {
    const documents = await MongoDocument.find().sort({ createdAt: 1 });
    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Некорректный id' });
    }

    const doc = await MongoDocument.findById(req.params.id);

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

router.post('/', async (req, res, next) => {
  try {
    const error = validateDocument(req.body);
    if (error) {
      return res.status(400).json({ success: false, error });
    }

    const doc = await MongoDocument.create(buildPayload(req.body));
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Некорректный id' });
    }

    const error = validateDocument(req.body);
    if (error) {
      return res.status(400).json({ success: false, error });
    }

    const doc = await MongoDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: `Документ с ID ${req.params.id} не найден`
      });
    }

    const payload = buildPayload(req.body);
    const previousStatus = doc.status;

    doc.set(payload);

    if (payload.status && payload.status !== previousStatus) {
      doc.history.push({
        fromStatus: previousStatus,
        toStatus: payload.status,
        note: req.body.note || 'Изменение статуса через PUT',
        changedAt: new Date()
      });
    }

    await doc.save();
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Некорректный id' });
    }

    const doc = await MongoDocument.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: `Документ с ID ${req.params.id} не найден`
      });
    }

    res.status(200).json({
      success: true,
      message: `Документ с ID ${req.params.id} удален`,
      data: doc
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/history', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Некорректный id' });
    }

    const { status, note } = req.body;
    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Поле 'status' обязательно. Разрешены: ${ALLOWED_STATUSES.join(', ')}`
      });
    }

    const current = await MongoDocument.findById(req.params.id);
    if (!current) {
      return res.status(404).json({
        success: false,
        error: `Документ с ID ${req.params.id} не найден`
      });
    }

    const doc = await MongoDocument.findByIdAndUpdate(
      req.params.id,
      {
        $set: { status },
        $push: {
          history: {
            fromStatus: current.status,
            toStatus: status,
            note: note || '',
            changedAt: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/history/:entryId', async (req, res, next) => {
  try {
    if (!isValidId(req.params.id) || !isValidId(req.params.entryId)) {
      return res.status(400).json({ success: false, error: 'Некорректный id' });
    }

    const set = { $inc: { 'history.$.edits': 1 } };
    if (req.body.note !== undefined) {
      set.$set = { 'history.$.note': req.body.note };
    }

    const doc = await MongoDocument.findOneAndUpdate(
      { _id: req.params.id, 'history._id': req.params.entryId },
      set,
      { new: true, runValidators: true }
    );

    if (!doc) {
      return res.status(404).json({
        success: false,
        error: 'Документ или запись истории не найдены'
      });
    }

    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const mongoose = require('mongoose');

const ALLOWED_TYPES = ['pdf', 'docx', 'image'];
const ALLOWED_STATUSES = ['uploaded', 'processing', 'ready'];

const historyEntrySchema = new mongoose.Schema({
  fromStatus: { type: String, enum: ALLOWED_STATUSES, required: true },
  toStatus: { type: String, enum: ALLOWED_STATUSES, required: true },
  note: { type: String, default: '' },
  edits: { type: Number, default: 0 },
  changedAt: { type: Date, default: Date.now }
});

const mongoDocumentSchema = new mongoose.Schema({
  fileName: { type: String, required: true, trim: true },
  fileType: { type: String, required: true, enum: ALLOWED_TYPES, lowercase: true },
  fileSizeBytes: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ALLOWED_STATUSES, default: 'uploaded' },
  authorEmail: { type: String, default: '' },
  history: [historyEntrySchema]
}, {
  timestamps: true,
  collection: 'mongo_documents'
});

const MongoDocument = mongoose.model('MongoDocument', mongoDocumentSchema);

module.exports = {
  MongoDocument,
  ALLOWED_TYPES,
  ALLOWED_STATUSES
};

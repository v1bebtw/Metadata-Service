'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Documents', [
      {
        fileName: 'diploma_draft.docx',
        fileType: 'docx',
        fileSizeBytes: 245000,
        uploadDate: now,
        metadata: JSON.stringify({
          author: 'Студент',
          pages: 45,
          software: 'Microsoft Office Word'
        }),
        status: 'uploaded',
        createdAt: now,
        updatedAt: now
      },
      {
        fileName: 'photo_scan.png',
        fileType: 'image',
        fileSizeBytes: 1850000,
        uploadDate: now,
        metadata: JSON.stringify({
          resolution: '1920x1080',
          colorDepth: '24-bit'
        }),
        status: 'ready',
        createdAt: now,
        updatedAt: now
      },
      {
        fileName: 'analytics_report.pdf',
        fileType: 'pdf',
        fileSizeBytes: 1048576,
        uploadDate: now,
        metadata: JSON.stringify({
          author: 'Иванов И.И.',
          pages: 24
        }),
        status: 'processing',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Documents', null, {});
  }
};

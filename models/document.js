'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      // связи появятся при развитии курсового проекта
    }
  }

  Document.init({
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSizeBytes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    uploadDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'uploaded'
    }
  }, {
    sequelize,
    modelName: 'Document'
  });

  return Document;
};

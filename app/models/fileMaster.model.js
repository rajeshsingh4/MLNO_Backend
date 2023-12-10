module.exports = (sequelize, Sequelize) => {
  const FileMaster = sequelize.define("fileMaster", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fileName: {type: Sequelize.STRING},
    DataProcessor: {type: Sequelize.STRING},
    BureauName: {type: Sequelize.STRING},
    FileAttribute: {type: Sequelize.STRING},
    CuffOffTime: {type: Sequelize.DATE},
    FileUploadTime: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    }
  });

  return FileMaster;
};

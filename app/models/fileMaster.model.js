module.exports = (sequelize, datatypes) => {
  const FileMaster = sequelize.define("fileMasters", {
    id: {
      type: datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fileName: { type: datatypes.STRING },
    DataProcessor: { type: datatypes.STRING },
    BureauName: { type: datatypes.STRING },
    FileAttribute: { type: datatypes.STRING },
    CutOffTime: { type: datatypes.DATE },
    FileUploadTime: {
      type: datatypes.DATE,
      defaultValue: new Date(),
    },
    createdBy: {
      type: datatypes.INTEGER,
      references: {
        model: sequelize.models.users,
        key: "id",
      },
    },
    modifiedBy: {
      type: datatypes.INTEGER,
      references: {
        model: sequelize.models.users,
        key: "id",
      },
    },
    createdAt: {
      type: datatypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: datatypes.DATE,
      defaultValue: new Date(),
    },
  });

  return FileMaster;
};

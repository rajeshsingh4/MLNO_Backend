module.exports = (sequelize, datatypes) => {
  const AuditLog = sequelize.define("audit_logs", {
    id: {
      type: datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cardId: {
      type: datatypes.INTEGER,
      references: {
        model: sequelize.models.cards,
        key: "id",
      },
    },
    previous: { type: datatypes.JSON },
    current: { type: datatypes.JSON },
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
  return AuditLog;
};

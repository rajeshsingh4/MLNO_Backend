module.exports = (sequelize, Sequelize) => {
  const AuditLog = sequelize.define("audit_logs", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cardId: { type: Sequelize.INTEGER },
    previous: { type: Sequelize.STRING },
    current: { type: Sequelize.STRING },
    createdBy: { type: Sequelize.STRING },
    modifiedBy: { type: Sequelize.STRING },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    }
  });
  return AuditLog;
};

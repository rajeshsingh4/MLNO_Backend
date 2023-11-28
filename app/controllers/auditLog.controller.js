const db = require("../models");
const config = require("../config/auth.config");
const AuditLog = db.auditLog;

exports.getAllAuditLogs = async (req, res) => {
  try {
    const auditLogsAll = await AuditLog.findAll();
    res.json(auditLogsAll);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getAuditLogsForCard = async (req, res) => {
  try {
    const cardLogs = await AuditLog.findAll({
      where: {
        cardId: req.params.id
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    res.json(cardLogs);
  } catch (error) {
    res.json({ message: error.message });
  }
};

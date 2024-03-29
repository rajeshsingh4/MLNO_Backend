const db = require("../models");
const AuditLog = db.auditLog;

exports.getAllAuditLogs = async (req, res) => {
  try {
    const auditLogsAll = await AuditLog.findAll();
    res.status(200).send(auditLogsAll);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
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
    res.status(200).send(cardLogs);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

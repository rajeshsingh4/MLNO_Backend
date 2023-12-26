const db = require("../models");
const AuditLog = db.auditLog;

exports.getAllPullRequestLogs = async (req, res) => {
  try {
    const auditLogsAll = await AuditLog.findAll({
      order: [
        ['updatedAt', 'DESC']
      ]
    });
    res.status(200).send(auditLogsAll);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

exports.getPullRequestLogsById = async (req, res) => {
  try {
    const cardLogs = await AuditLog.findOne({
      where: {
        id: req.params.id
      },
      order: [
        ['updatedAt', 'DESC']
      ]
    });
    res.status(200).send(cardLogs);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

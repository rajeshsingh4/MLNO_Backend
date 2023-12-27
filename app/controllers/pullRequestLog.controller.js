const db = require("../models");
const PullRequestLog = db.pullRequestLog;

exports.getAllPullRequestLogs = async (req, res) => {
  try {
    const findConditions = {
      where: {},
      order: [
        ['updatedAt', 'DESC']
      ]
    };
    if (req.query.cardId) {
      findConditions.where.cardId = req.query.cardId;
    }
    if (req.query.fileMasterId) {
      findConditions.where.fileMasterId = req.query.fileMasterId;
    }
    if (req.query.pullRequestId) {
      findConditions.where.pullRequestId = req.query.pullRequestId;
    }
    const pullLogs = await PullRequestLog.findAll(findConditions);
    res.status(200).send(pullLogs);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

exports.getPullRequestLogsById = async (req, res) => {
  try {
    const pullLog = await PullRequestLog.findOne({
      where: {
        id: req.params.id
      }
    });
    res.status(200).send(pullLog);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

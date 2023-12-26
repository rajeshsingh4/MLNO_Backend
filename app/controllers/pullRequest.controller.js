const db = require("../models");
const PullRequest = db.pullrequest;
const PullRequestLog = db.pullRequestLog;
const Card = db.card;
const File = db.fileMaster;
const User = db.user;

exports.getPullRequest = async (req, res) => {
  try {
    const pullrequest = await PullRequest.findAll({
      order: [
        ['updatedAt', 'DESC']
      ]
    });
    res.status(200).send(pullrequest);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

exports.getPullRequestByPullId = async (req, res) => {
  try {
    const id = req.params.id;
    let findConditions = {
      where: {
        id: id,
      },
      include: [
        {
          model: User
        },
        {
          model: File,
        },
        {
          model: Card,
        }
      ]
    };
    const pullRequestDetails = await PullRequest.findOne(findConditions);
    res.status(200).send(pullRequestDetails);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

exports.createPullRequest = async (req, res) => {
    try {
        const reqPayload = req.body;
        // create pull request logs
        const logsData = {
          cardId: reqPayload.cardId,
          fileMasterId: reqPayload.fileMasterId,
          previous: JSON.stringify(cardtracking),
          current: JSON.stringify(reqPayload),
          createdBy: req.userId,
          modifiedBy: req.userId,
          userId: req.userId
        };
        const createLogs = await PullRequestLog.create(logsData);
        console.log('pull request log entry created: ', createLogs);
        // create pull request
        const createRecord = await PullRequest.create(reqPayload);
        res.status(200).send(createRecord);
    } catch (error) {
        res.status(400).send({ status: 400, message: error.message });
    }
}
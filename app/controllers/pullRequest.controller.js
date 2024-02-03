const db = require("../models");
const PullRequest = db.pullrequest;
const PullRequestLog = db.pullRequestLog;
const Card = db.card;
const File = db.fileMaster;
const User = db.user;

const sequelize = db.sequelize;

exports.getPullRequest = async (req, res) => {
  try {
    let findAllConditions = {
      where: {},
      order: [
        ['updatedAt', 'DESC']
      ],
      include: [
        {
          model: Card,
          attributes: ['Bank', 'id'],
          where: {
            Bank: req.organisation
          }
        },
      ]
    };
    if (req.query.bureau) {
      findAllConditions = {
        ...findAllConditions,
        include: {
          model: File,
          as: 'fileMaster',
          attributes: ['BureauName'],
          where: { BureauName: req.query.bureau },
          required: true
        }
      }
    }
    const pullrequest = await PullRequest.findAll(findAllConditions);
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
    // create pull request
    const createRecord = await PullRequest.create({ ...reqPayload, createdBy: req.userId, modifiedBy: req.userId, userId: req.userId });

    // create pull request logs
    const logsData = {
      cardId: createRecord.cardId,
      serviceRequestId: createRecord.serviceRequest,
      pullRequestId: createRecord.id,
      fileMasterId: createRecord.fileMasterId,
      previous: JSON.stringify(createRecord),
      current: JSON.stringify(createRecord),
      createdBy: req.userId,
      modifiedBy: req.userId,
      userId: req.userId
    };
    const createLogs = await PullRequestLog.create(logsData);
    console.log('pull request log entry created: ', createLogs);
    res.status(200).send(createRecord);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
}

exports.updatePullRequest = async (req, res) => {
  try {
    const reqPayload = req.body;
    const currentRecord = await PullRequest.findOne({
      where: {
        id: req.params.id
      }
    });

    // update pull request
    const updateData = { ...reqPayload, modifiedBy: req.userId, updatedAt: new Date() };
    const updatedRecord = await PullRequest.update(
      updateData,
      {
        where: {
          id: req.params.id
        }
      }
    );

    // create pull request logs
    const logsData = {
      cardId: currentRecord.cardId,
      serviceRequestId: currentRecord.serviceRequest,
      pullRequestId: currentRecord.id,
      fileMasterId: currentRecord.fileMasterId,
      previous: JSON.stringify(currentRecord),
      current: JSON.stringify({...currentRecord.dataValues, ...updateData}),
      createdBy: req.userId,
      modifiedBy: req.userId,
      userId: req.userId
    };
    const createLogs = await PullRequestLog.create(logsData);
    console.log('pull request log entry updated: ', createLogs);
    res.status(200).send(updatedRecord);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
}

exports.getBankPullRequestDashboard = async (req, res) => {
  try {
    const cards = await Card.findAll({
      where: {
          Bank: req.organisation
      },
      group: ['Bank', 'Bureau_Status', 'Courier_Status'],
      attributes: [
          'Bank', 'Bureau_Status', 'Courier_Status',
          [sequelize.fn('COUNT', sequelize.col('Bank')), 'total_bank_records'],
          [sequelize.fn('COUNT', sequelize.col('Bureau_Status')), 'total_bureau_status'],
          [sequelize.fn('COUNT', sequelize.col('Courier_Status')), 'total_courier_status'],
      ]
    });
    res.status(200).send(cards);
  } catch (error) {
    res.status(400).send({ status:400, message: error.message });
  }
}

exports.getBureauPullRequestDashboard = async (req, res) => {
  try {
    const cards = await Card.findAll({
      where: {
          Bank: req.organisation
      },
      group: ['Bank', 'Bureau_Status', 'Courier_Status'],
      attributes: [
          'Bank', 'Bureau_Status', 'Courier_Status',
          [sequelize.fn('COUNT', sequelize.col('Bank')), 'total_bank_records'],
          [sequelize.fn('COUNT', sequelize.col('Bureau_Status')), 'total_bureau_status'],
          [sequelize.fn('COUNT', sequelize.col('Courier_Status')), 'total_courier_status'],
      ]
    });
    res.status(200).send(cards);
  } catch (error) {
    res.status(400).send({ status:400, message: error.message });
  }
}
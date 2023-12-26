const db = require("../models");
const PullRequest = db.pullrequest;
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
        const createRecord = PullRequest.create(reqPayload);
        res.status(200).send(createRecord);
    } catch (error) {
        res.status(400).send({ status: 400, message: error.message });
    }
}
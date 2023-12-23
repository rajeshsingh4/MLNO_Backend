const db = require("../models");
const PullRequest = db.pullrequest;
const Card = db.card;
const File = db.fileMaster;
const User = db.user;

exports.getPullRequest = async (req, res) => {
  try {
    const pullrequest = await PullRequest.findAll();
    res.json(pullrequest);
  } catch (error) {
    res.json({ message: error.message, status: 404 });
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
    res.json(pullRequestDetails);
  } catch (error) {
    res.json({ message: error.message, status: 404 });
  }
};

exports.createPullRequest = async (req, res) => {
    try {
        console.log('received request, we are working on it');
        res.json('received request, we are working on it');
    } catch (error) {
        res.json({ message: error.message, status: 400 });
    }
}
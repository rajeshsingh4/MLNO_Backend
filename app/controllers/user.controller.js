const db = require("../models");
const User = db.user;
const UserDetails = db.userDetails;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.getUserDetails = (req, res) => {
  try {
    const userDetails = UserDetails.findOne({
      where: {
        userId: req.userId
      }
    })
    res.status(200).send(userDetails);
  } catch(err) {
    res.status(400).send({
      statu: 400,
      message: err.message
    })
  }
}
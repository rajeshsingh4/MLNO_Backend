const db = require("../models");
const User = db.user;
const UserDetails = db.userDetails;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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

exports.getAllUserList = async (req, res) => {
  try {
    const userList = await UserDetails.findAll({
      include: {
        model: User
      }
    });
    res.status(200).send(userList);
  } catch (err) {
    res.status(400).send({
      statu: 400,
      message: err.message,
    });
  }
}

exports.getUserDetails = async (req, res) => {
  try {
    const userDetails = await UserDetails.findOne({
      where: {
        userId: req.userId,
      },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "username", "email"],
        required: true,
      },
    });
    res.status(200).send(userDetails);
  } catch (err) {
    res.status(400).send({
      statu: 400,
      message: err.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    // check current password
    const currentUser = await User.findByPk(req.userId);

    const passwordIsValid = bcrypt.compareSync(
      currentPassword,
      currentUser.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({
        invalidPassword: true,
        message: "Invalid Current Password!",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).send({
        passwordMatch: false,
        message: "Password does not match",
      });
    }

    // update password
    const user = await User.update(
      { password: bcrypt.hashSync(newPassword, 8) },
      {
        where: {
          id: req.userId,
        },
      }
    );
    res.status(200).send({ message: "Password updated successfully", logoutUser: true, time: 5000 });
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};

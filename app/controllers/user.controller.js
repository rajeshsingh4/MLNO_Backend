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

exports.createNewUser = async (req, res) => {
  try {
    const emailExists = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (emailExists) {
      return res.status(400).send({
        status: 400,
        message: 'Email Already exists'
      })
    }
    const userExists = await User.findOne({
      where: {
        username: req.body.username
      }
    });
    if (userExists) {
      return res.status(400).send({
        status: 400,
        message: 'Username already exists'
      })
    }
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync('Password@12', 8),
      type: req.body.type,
      organisation: req.body.organisation
    });
    const userRoles = await user.setRoles([1]);
    const { firstname, lastname, middlename, pincode, phone, address, bio } = req.body;
    const userDetailsBody = { firstname, lastname, middlename, pincode, phone, address, bio, createdBy: req.userId, modifiedBy: req.userId, userId: user.id }
    const userDetails = await UserDetails.create(userDetailsBody);
    return res.status(200).send({
      ...userDetails,
      user: user,
      roles: userRoles
    });
  } catch (err) {
    return res.status(400).send({
      statu: 400,
      message: err.message,
    });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const userDetails = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!userDetails) {
      return res.status(404).send({
        status: 404,
        message: 'User Not found!'
      });
    } else {
      await UserDetails.update(
        {
          ...req.body,
          modifiedBy: req.userId,
          updatedAt: new Date()
        },
        {
          where: {
            id: req.params.id
          }
        }
      );
      res.status(200).send({
        status: 200,
        message: 'User updated successfully',
      });
    }
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

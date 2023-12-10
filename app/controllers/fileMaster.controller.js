const db = require("../models");
const config = require("../config/auth.config");
const FileMaster = db.fileMaster;
const Card = db.card;
const AuditLog = db.auditLog;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getFileTracking = async (req, res) => {
  try {
    const cardtracking = await FileMaster.findAll({
      include: [{model: Card}]
    });
    res.json(cardtracking);
  } catch (error) {
    res.json({ message: error.message });
  }
};

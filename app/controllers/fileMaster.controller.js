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
    const allFiles = await FileMaster.findAll({
      include: [{model: Card}]
    });
    res.json(allFiles);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.getFileTrackingById = async (req, res) => {
  try {
    const fileDetailsByFileId = await FileMaster.findOne({
      where: {
        id: req.params.id
      },
      include: [{model: Card}]
    });
    res.json(fileDetailsByFileId);
  } catch (error) {
    res.json({ message: error.message });
  }
};

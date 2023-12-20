const db = require("../models");
// const config = require("../config/auth.config");
const Card = db.card;
const AuditLog = db.auditLog;
const File = db.fileMaster;

// const Op = db.Sequelize.Op;

// var jwt = require("jsonwebtoken");
// var bcrypt = require("bcryptjs");

exports.getCardTracking = async (req, res) => {
  try {
    let findAllConditions = {};
    if (req.query.fileList) {
      findAllConditions = {
        include: [{
          model: File
        }]
      }
    }
    const cardtracking = await Card.findAll(findAllConditions);
    res.json(cardtracking);
  } catch (error) {
    res.json({ message: error.message });
  }
};

exports.updateCardTracking = async (req, res) => {
  const reqPayload = req.body;
  const cardId = req.params.id;
  try {
    const cardtracking = await Card.findOne({
      where: {
        id: cardId,
      },
    });
    // create an entry in audit log table
    const auditLogRecord = await AuditLog.create({
      cardId: cardId,
      previous: JSON.stringify(cardtracking),
      current: JSON.stringify(reqPayload),
      createdBy: 1,
      modifiedBy: 1,
    });
    console.log("audit log entry created ", auditLogRecord);
    // update the current record
    const updatedTracking = await Card.update(
      reqPayload,
      {
        where: {
          id: cardId,
        },
      }
    );
    res.json(updatedTracking);
  } catch (error) {
    console.log("error updating record ", error);
    res.json({ message: error.message });
  }
};

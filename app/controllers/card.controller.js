const db = require("../models");
const Card = db.card;
const AuditLog = db.auditLog;
const File = db.fileMaster;
const Op = db.Sequelize.Op;

exports.getCardTrackingForBank = async (req, res) => {
  try {
    let findAllConditions = {
      where: {
        Bank: req.organisation,
        Bureau_Status: {
          [Op.or]: [0, null]
      },
      },
      include: [
        {
          model: File,
        },
      ]
    };
    if (req.query.fileId) {
      findAllConditions.where['fileMasterId'] = req.query.fileId;
    }
    const cardtracking = await Card.findAll(findAllConditions);
    res.status(200).send(cardtracking);
  } catch (error) {
    res.status(400).send({ status:400, message: error.message });
  }
};

exports.getCardTrackingForBureau = async (req, res) => {
  try {
    let findAllConditions = {
      where: {
        Bureau_Status: {
          [Op.or]: [0, null]
        },
      },
      include: [
        {
          model: File,
          where: {
            BureauName: req.organisation,
          }
        },
      ]
    };
    if (req.query.fileId) {
      findAllConditions.where['fileMasterId'] = req.query.fileId;
    }
    const cardtracking = await Card.findAll(findAllConditions);
    res.status(200).send(cardtracking);
  } catch (error) {
    res.status(400).send({ status:400, message: error.message });
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

    // update the current record
    const cardUpdateData = {...reqPayload, modifiedBy: req.userId, updatedAt: new Date() };
    const updatedTracking = await Card.update(
      cardUpdateData,
      {
        where: {
          id: cardId,
        },
      }
    );

    // create an entry in audit log table
    const auditLogRecord = await AuditLog.create({
      cardId: cardId,
      previous: JSON.stringify(cardtracking),
      current: JSON.stringify({...cardtracking.dataValues, ...cardUpdateData}),
      createdBy: req.userId,
      modifiedBy: req.userId,
      userId: req.userId,
    });
    console.log("audit log entry created ", auditLogRecord);

    res.status(200).send(updatedTracking);
  } catch (error) {
    console.log("error updating record ", error);
    res.status(400).send({ status: 400, message: error.message });
  }
};

exports.sendCardTrackingToCourier = async (req, res) => {
  const reqPayload = req.body;
  const cardId = req.params.id;
  try {
    const cardtracking = await Card.findOne({
      where: {
        id: cardId,
      },
    });

    // update the current record
    const cardUpdateData = {...reqPayload, Bureau_Status: 1, Courier_Status: 0, Courier_Status_Timestamp: new Date(), modifiedBy: req.userId, updatedAt: new Date()};
    const updatedTracking = await Card.update(
      cardUpdateData,
      {
        where: {
          id: cardId,
        },
      }
    );

    // create an entry in audit log table
    const auditLogRecord = await AuditLog.create({
      cardId: cardId,
      previous: JSON.stringify(cardtracking),
      current: JSON.stringify({...cardtracking.dataValues, ...cardUpdateData}),
      createdBy: req.userId,
      modifiedBy: req.userId,
      userId: req.userId,
    });
    console.log("audit log entry created ", auditLogRecord);

    res.status(200).send(updatedTracking);
  } catch (error) {
    console.log("error updating record ", error);
    res.status(400).send({ status: 400, message: error.message });
  }
};

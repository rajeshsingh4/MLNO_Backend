const db = require("../models");
const config = require("../config/auth.config");
const Card = db.card;


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.getCardTracking = async (req, res) => {

  try {
    const cardtracking = await Card.findAll()
    res.json(cardtracking)
  } catch (error) {
      res.json({message: error.message})
  }
  
};


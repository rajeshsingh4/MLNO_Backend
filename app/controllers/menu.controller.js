const db = require("../models");
const { authJwt } = require("../middleware");
// const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");


const Menu = db.menu;
const Role = db.role;
const User = db.user;

// const Op = db.Sequelize.Op;

// var jwt = require("jsonwebtoken");
// var bcrypt = require("bcryptjs");

exports.getMenuList = async (req, res) => {
  try {
    console.log('------------- get UserID ROLES --------------');
    User.findByPk(req.userId).then(user => {
      console.log('------------- get roles -------------');
      console.log( user );
      var roleList =[];
      user.getRoles().then(roles => {
        console.log('------------- get roles Fetched -------------------->>',roles);
        for (let i = 0; i < roles.length; i++) {
          roleList.push(roles[i].id);
        }
      })
    })
    /*const menuList = await Menu.findAll({
      include: {
        model: Role,
        as: 'roles',
        attributes: ['id','name'],
        through: { where: { roleId: 1 } }
      }
    });*/
    const menuList = await Menu.findAll({
      include: {
        model: Role,
        as: 'roles',
        attributes: ['id','name'],
        through: { where: { roleId: 0 } },
        required: true
      }
    });

    res.json(menuList);
  } catch (error) {
    res.json({ message: error.message });
  }
};
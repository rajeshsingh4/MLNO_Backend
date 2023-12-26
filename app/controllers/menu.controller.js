const db = require("../models");
const Menu = db.menu;
const Role = db.role;
const User = db.user;

exports.getMenuList = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    const userRoles = await user.getRoles({
      attributes: ['id']
    });
    let roleList = [];
    for (let i = 0; i < userRoles.length; i++) {
      roleList.push(userRoles[i].id);
    }
    const menuList = await Menu.findAll({
      include: {
        model: Role,
        as: 'roles',
        attributes: ['id','name'],
        through: { where: { roleId: roleList } },
        required: true
      }
    });
    res.status(200).send(menuList);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};
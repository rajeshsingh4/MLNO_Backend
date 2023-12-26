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
    const menuList = await Menu.findAll({
      include: {
        model: Role,
        as: 'roles',
        attributes: ['id','name'],
        through: { where: { roleId: userRoles } },
        required: true
      }
    });
    res.status(200).send(menuList);
  } catch (error) {
    res.status(400).send({ status: 400, message: error.message });
  }
};
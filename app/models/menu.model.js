module.exports = (sequelize, Sequelize) => {
  const Menu = sequelize.define("menus", {
    label: {
      type: Sequelize.STRING
    },
    path: {
      type: Sequelize.STRING
    }
  });

  return Menu;
};

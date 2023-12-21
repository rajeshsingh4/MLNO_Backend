const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.fileMaster = require("../models/fileMaster.model.js")(sequelize, Sequelize);
db.card = require("../models/card.model.js")(sequelize, Sequelize);
db.auditLog = require("../models/auditLog.model.js")(sequelize, Sequelize);
db.cardUpdates = require("../models/cardUpdates.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.fileMaster.hasMany(db.card);
db.card.belongsTo(db.fileMaster);

db.ROLES = ["user", "admin", "moderator",];

module.exports = db;

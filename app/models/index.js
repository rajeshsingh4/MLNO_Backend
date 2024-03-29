const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.userDetails = require("../models/userDetails.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.fileMaster = require("../models/fileMaster.model.js")(sequelize, Sequelize);
db.card = require("../models/card.model.js")(sequelize, Sequelize);
db.pullrequest = require("../models/pullRequest.model.js")(
  sequelize,
  Sequelize
);
db.auditLog = require("../models/auditLog.model.js")(sequelize, Sequelize);
db.pullRequestLog = require("../models/pullRequestLog.model.js")(sequelize, Sequelize);
db.menu = require("../models/menu.model.js")(sequelize, Sequelize);


db.role.belongsToMany(db.user, {
  through: "user_roles",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
});

db.role.belongsToMany(db.menu, {
  through: "menu_roles"
});
db.menu.belongsToMany(db.role, {
  through: "menu_roles"
});

//user details relationship
db.userDetails.belongsTo(db.user);

//file masters relationship
db.fileMaster.belongsTo(db.user);

//cards relationship
db.fileMaster.hasMany(db.card);
db.card.belongsTo(db.fileMaster);
db.card.belongsTo(db.user);

//pull requests relationship
db.pullrequest.belongsTo(db.user);
db.pullrequest.belongsTo(db.card);
db.pullrequest.belongsTo(db.fileMaster);

//audit logs relationship
db.auditLog.belongsTo(db.user);
db.auditLog.belongsTo(db.card);

//pull request log relationship
db.pullRequestLog.belongsTo(db.user);
db.pullRequestLog.belongsTo(db.pullrequest);
db.pullrequest.belongsTo(db.card);
db.pullrequest.belongsTo(db.fileMaster);

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;

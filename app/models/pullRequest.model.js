module.exports = (sequelize, datatypes) => {
  const PullRequestModel = sequelize.define("pullRequests", {
    id: {
      type: datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cardId: {
      type: datatypes.INTEGER,
      references: {
        model: sequelize.models.cards,
        key: "id",
      },
    },
    fileMasterId: {
      type: datatypes.INTEGER,
      references: {
        model: sequelize.models.fileMasters,
        key: "id",
      },
    },
    createdBy: {
      type: datatypes.INTEGER,
      references: {
        model: sequelize.models.users,
        key: 'id'
      }
    },
    modifiedBy: {
      type: datatypes.INTEGER,
      references: {
        model: sequelize.models.users,
        key: 'id'
      }
    },
    createdAt: {
      type: datatypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: datatypes.DATE,
      defaultValue: new Date(),
    },
  });
  return PullRequestModel;
};
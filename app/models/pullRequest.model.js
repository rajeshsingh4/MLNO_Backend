module.exports = (sequelize, datatypes) => {
  const PullRequestModel = sequelize.define("pullRequests", {
    id: {
      type: datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: datatypes.STRING
    },
    changeCommunicatedTo: {
      type: datatypes.STRING
    },
    field: {
      type: datatypes.STRING
    },
    originalValue: {
      type: datatypes.STRING
    },
    newValue: {
      type: datatypes.STRING
    },
    mode: {
      type: datatypes.STRING
    },
    comment: {
      type: datatypes.STRING
    },
    ipaddress: {
      type: datatypes.STRING
    },
    serviceRequest: {
      type: datatypes.UUID,
      defaultValue: datatypes.UUIDV4
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
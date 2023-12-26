module.exports = (sequelize, datatypes) => {
  const User = sequelize.define("userdetails", {
    id: {
      type: datatypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: datatypes.STRING,
    },
    middlename: {
      type: datatypes.STRING,
    },
    lastname: {
      type: datatypes.STRING,
    },
    address: {
      type: datatypes.STRING,
    },
    pincode: {
      type: datatypes.INTEGER(6),
      validate: {
        is: /^[0-9]{6}$/i
      }
    },
    bio: {
      type: datatypes.STRING,
    },
    phone: {
      type: datatypes.STRING(10),
      validate: {
        is: /^[0-9]{10}$/i
      }
    },
    createdBy: {
      type: datatypes.INTEGER,
      references: {
        model: sequelize.models.users,
        key: "id",
      },
    },
    modifiedBy: {
      type: datatypes.INTEGER,
      references: {
        model: sequelize.models.users,
        key: "id",
      },
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

  return User;
};

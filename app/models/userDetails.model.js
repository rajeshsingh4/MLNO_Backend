module.exports = (sequelize, datatypes) => {
    const User = sequelize.define("userdetails", {
        id: {
            type: datatypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstname: {
            type: datatypes.STRING
        },
        middlename: {
            type: datatypes.STRING
        },
        lastname: {
            type: datatypes.STRING
        },
        address: {
            type: datatypes.STRING
        },
        pincode: {
            type: datatypes.STRING
        },
        bio: {
            type: datatypes.STRING
        },
        phone: {
            type: datatypes.STRING
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

    return User;
};

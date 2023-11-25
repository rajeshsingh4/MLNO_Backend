module.exports = (sequelize, Sequelize) => {
  const Cards = sequelize.define("cards", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Bank: {type: Sequelize.STRING},
    Date: {type: Sequelize.DATE},
    Product: {type: Sequelize.DATE},
    Logo: {type: Sequelize.DATE},
    Scheme: {type: Sequelize.DATE},
    Name: {type: Sequelize.DATE},
    Address1: {type: Sequelize.DATE},
    Address2: {type: Sequelize.DATE},
    Address3: {type: Sequelize.DATE},
    City: {type: Sequelize.DATE},
    State: {type: Sequelize.DATE},
    Pin: {type: Sequelize.DATE},
    Mobile: {type: Sequelize.DATE},
    Other_Contact: {type: Sequelize.DATE},
    Reference_No: {type: Sequelize.DATE},
    AWB_No: {type: Sequelize.DATE},
    RTO_Address1: {type: Sequelize.DATE},
    RTO_Address2: {type: Sequelize.DATE},
    RTO_Address3: {type: Sequelize.DATE},
    RTO_City: {type: Sequelize.DATE},
    RTO_State: {type: Sequelize.DATE},
    RTO_Pin: {type: Sequelize.DATE},
    Office_Address1: {type: Sequelize.DATE},
    Office_Address2: {type: Sequelize.DATE},
    Office_Address3: {type: Sequelize.DATE},
    Office_City: {type: Sequelize.DATE},
    Office_State: {type: Sequelize.DATE},
    Office_Pin: {type: Sequelize.DATE},
    PA_Flag: {type: Sequelize.DATE},
    NRWC_Flag: {type: Sequelize.DATE},
    Priority: {type: Sequelize.DATE},
    Third_Party: {type: Sequelize.DATE},
    Bureau_Code: {type: Sequelize.DATE},
    Courier_Code: {type: Sequelize.DATE},
    Form_Factor: {type: Sequelize.DATE},
    Comments: {type: Sequelize.DATE},
    Personalized_NonPersonalized: {type: Sequelize.DATE},
    Individual_Bulk_Break: {type: Sequelize.DATE},
    Sub_Customer: {type: Sequelize.DATE},
    Status: {type: Sequelize.DATE},
    If_PULL: {type: Sequelize.DATE},
    Field_1: {type: Sequelize.DATE},
    Field_2: {type: Sequelize.DATE},
    Field_3: {type: Sequelize.DATE},
    Field_4: {type: Sequelize.DATE},
    Field_5: {type: Sequelize.DATE},
    Field_6: {type: Sequelize.DATE},
    Field_7: {type: Sequelize.DATE},
    Bureau_Status: {type: Sequelize.TEXT},
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: new Date(),
    }
  });

  return Cards;
};

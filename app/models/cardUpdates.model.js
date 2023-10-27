module.exports = (sequelize, Sequelize) => {
  const CardsUpdates = sequelize.define("cardsUpdates", {
    Changemode: {type: Sequelize.STRING},
    Logjson: {type: Sequelize.TEXT},
    Comments: {type: Sequelize.DATE}
  });

  return CardsUpdates;
};

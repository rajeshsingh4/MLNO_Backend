const { authJwt } = require("../middleware");
const controller = require("../controllers/card.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, x-user-type, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/cardtrack/bank/all", [authJwt.verifyToken], controller.getCardTrackingForBank);
  app.get("/api/cardtrack/bureau/all", [authJwt.verifyToken], controller.getCardTrackingForBureau);
  app.put("/api/cardtrack/:id", [authJwt.verifyToken], controller.updateCardTracking);
  app.post("/api/cardtrack/:id/courier/start", [authJwt.verifyToken], controller.sendCardTrackingToCourier);
};

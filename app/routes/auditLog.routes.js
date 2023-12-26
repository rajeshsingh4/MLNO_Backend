const { authJwt } = require("../middleware");
const controller = require("../controllers/auditLog.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/auditlog/all", [authJwt.verifyToken], [authJwt.getUserDetail], controller.getAllAuditLogs);
  app.get("/api/auditlog/card/:id",  [authJwt.verifyToken], [authJwt.getUserDetail], controller.getAuditLogsForCard);
};

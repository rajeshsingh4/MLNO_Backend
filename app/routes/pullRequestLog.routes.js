const { authJwt } = require("../middleware");
const controller = require("../controllers/pullRequestLog.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/pullrequestlog/all", [authJwt.verifyToken], [authJwt.getUserDetail], controller.getAllPullRequestLogs);
  app.get("/api/pullrequestlog/:id", [authJwt.verifyToken], [authJwt.getUserDetail], controller.getPullRequestLogsById);
};

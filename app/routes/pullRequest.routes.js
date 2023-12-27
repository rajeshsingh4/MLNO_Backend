const { authJwt } = require("../middleware");
const controller = require("../controllers/pullRequest.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/pull-request/all", [authJwt.verifyToken], controller.getPullRequest);
  app.get("/api/pull-request/:id", [authJwt.verifyToken], controller.getPullRequestByPullId);
  app.post("/api/pull-request", [authJwt.verifyToken], controller.createPullRequest);
  app.put("/api/pull-request/:id", [authJwt.verifyToken], controller.updatePullRequest);
};
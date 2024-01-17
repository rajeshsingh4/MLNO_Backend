const { authJwt } = require("../middleware");
const controller = require("../controllers/dashboard.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, x-user-type, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/dashboard/bank", [authJwt.verifyToken], controller.getBankDashboard);
  app.get("/api/dashboard/bureau", [authJwt.verifyToken], controller.getBureauDashboard);
  app.get("/api/dashboard/courier", [authJwt.verifyToken], controller.getCourierDashboard);
};

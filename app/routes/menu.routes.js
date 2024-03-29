const { authJwt } = require("../middleware");
const controller = require("../controllers/menu.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, x-user-type, Origin, Content-Type, Accept",
    );
    next();
  });

  app.get("/api/menu/all", [authJwt.verifyToken], [authJwt.getUserDetail],controller.getMenuList);
};

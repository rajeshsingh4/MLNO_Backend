const { authJwt } = require("../middleware");
const controller = require("../controllers/fileMaster.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/fileList/all", controller.getFileTracking);
  app.get("/api/fileList/:id", controller.getFileTrackingById);
  app.get("/api/bureauTAT/all", controller.getBureauTracking);
  app.get("/api/bureauData/:id", controller.fetchBureauData);
  
};

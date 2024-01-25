const { authJwt } = require("../middleware");
const controller = require("../controllers/fileMaster.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, x-user-type, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/fileList/all", [authJwt.verifyToken], controller.getFileTracking);
  app.get("/api/fileList/all/bank", [authJwt.verifyToken], controller.getPendingReportForBankFiles);
  app.get("/api/fileList/all/bureau", [authJwt.verifyToken], controller.getPendingReportForBureauFiles);
  app.get("/api/fileList/:id", [authJwt.verifyToken], controller.getFileTrackingById);
  app.get("/api/bureauTAT/all", [authJwt.verifyToken], [authJwt.getUserDetail], controller.getBureauTracking);
  app.get("/api/bureauData/:id", [authJwt.verifyToken], [authJwt.getUserDetail], controller.fetchBureauData);
  
};

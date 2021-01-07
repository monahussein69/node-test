const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Normal user routes
  app.get(
    "/api/user/profile",
    [authJwt.verifyToken, authJwt.isUser],
    controller.userInfo
  );

  app.post(
    "/api/user/subscribe_to_store",
    [authJwt.verifyToken, authJwt.isUser],
    controller.subscribeToStore
  );

  app.get(
    "/api/test/manager",
    [authJwt.verifyToken, authJwt.isManager],
    controller.managerBoard
  );

  app.get(
    "/api/test/sub-admin",
    [authJwt.verifyToken, authJwt.isSubAdmin],
    controller.subAdminBoard
  );

  app.get(
    "/api/test/support",
    [authJwt.verifyToken, authJwt.isSupport],
    controller.supportBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};

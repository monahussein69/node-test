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
};

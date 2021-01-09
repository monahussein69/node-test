const { authJwt, adminVerifySignUp } = require("../middleware");
const controller = require("../controllers/admin.controller");

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
    "/api/admin/profile",
    [authJwt.verifyToken, authJwt.isAdmins],
    controller.adminInfo
  );

  app.get(
    "/api/admin/getAdminUsers",
    [authJwt.verifyToken, authJwt.isAdmins],
    controller.getAdminUsers
  );

  app.get("/api/admin/getRoles", controller.getRoles);

  app.get("/api/admin/getAdmins", controller.getAdmins);

  app.post(
    "/api/admin/addAdminHelps",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      adminVerifySignUp.checkDuplicateUsernameOrEmail
    ],
    controller.addAdminHelps
  );
};

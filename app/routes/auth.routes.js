const { verifySignUp, adminVerifySignUp } = require("../middleware");
const adminController = require("../controllers/admin.auth.controller");
const userController = require("../controllers/user.auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    userController.signup
  );

  app.post("/api/auth/signin", userController.signin);

  app.post(
    "/api/auth/admin/signup",
    [
      adminVerifySignUp.checkDuplicateUsernameOrEmail,
      adminVerifySignUp.checkRolesExisted
    ],
    adminController.signup
  );

  app.post("/api/auth/admin/signin", adminController.signin);
};

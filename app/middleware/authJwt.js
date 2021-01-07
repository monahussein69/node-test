const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Admin = db.admin;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    req.type = decoded.type;
    next();
  });
};

isUser = (req, res, next) => {
  if (!(req.type == "user")) {
    res.status(403).send({
      message: "Require User Role!"
    });
    return;
  }
  User.findByPk(req.userId)
    .then(user => {
      user.getRole().then(role => {
        console.log(role);
        if (role.name === "user") {
          next();
          return;
        }
        res.status(403).send({
          message: "Require User Role!"
        });
        return;
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

isAdmin = (req, res, next) => {
  if (!(req.type == "admin")) {
    res.status(403).send({
      message: "Require Admin Role!"
    });
    return;
  }
  Admin.findByPk(req.userId)
    .then(admin => {
      admin.getRole().then(role => {
        if (role.name === "admin") {
          next();
          return;
        }
        res.status(403).send({
          message: "Require Admin Role!"
        });
        return;
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

isSupport = (req, res, next) => {
  if (!(req.type == "support")) {
    res.status(403).send({
      message: "Require Support Role!"
    });
    return;
  }

  Admin.findByPk(req.userId)
    .then(admin => {
      admin.getRole().then(role => {
        if (role.name === "support") {
          next();
          return;
        }

        res.status(403).send({
          message: "Require Support Role!"
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

isManager = (req, res, next) => {
  if (!(req.type == "manager")) {
    res.status(403).send({
      message: "Require Manager Role!"
    });
    return;
  }

  Admin.findByPk(req.userId)
    .then(admin => {
      admin.getRole().then(role => {
        if (roles.name === "manager") {
          next();
          return;
        }

        res.status(403).send({
          message: "Require Manager Role!"
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

isSubAdmin = (req, res, next) => {
  if (!(req.type == "admin")) {
    res.status(403).send({
      message: "Require Sub Admin Role!"
    });
    return;
  }

  Admin.findByPk(req.userId)
    .then(admin => {
      admin.getRole().then(role => {
        if (role.name === "sub-admin") {
          next();
          return;
        }

        res.status(403).send({
          message: "Require Sub Admin Role!"
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

isAdmins = (req, res, next) => {
  if (req.type == "user") {
    res.status(403).send({
      message: "Require any Admin Role!"
    });
    return;
  }

  Admin.findByPk(req.userId)
    .then(admin => {
      admin.getRole().then(role => {
        if (
          role.name === "sub-admin" ||
          role.name === "admin" ||
          role.name === "support" ||
          role.name === "manager"
        ) {
          next();
          return;
        }

        res.status(403).send({
          message: "Require any Admin Role!"
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isSubAdmin: isSubAdmin,
  isManager: isManager,
  isSupport: isSupport,
  isUser: isUser,
  isAdmins: isAdmins
};
module.exports = authJwt;

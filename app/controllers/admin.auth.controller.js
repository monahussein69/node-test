const db = require("../models");
const config = require("../config/auth.config");
const Admin = db.admin;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database

  if (req.body.role) {
    Role.findOne({
      where: {
        name: req.body.role
      }
    })
      .then(role => {
        Admin.create({
          username: req.body.username,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          roleId: role.id
        })
          .then(admin => {
            var token = jwt.sign(
              { id: admin.id, type: "admin" },
              config.secret,
              {
                expiresIn: 86400 // 24 hours
              }
            );

            res.send({
              id: admin.id,
              username: admin.username,
              email: admin.email,
              role: role.name,
              accessToken: token
            });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  } else {
    res.status(500).send({ message: "you have to add role" });
  }
};

exports.signin = (req, res) => {
  Admin.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(admin => {
      if (!admin) {
        return res.status(404).send({ message: "Admin Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        admin.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: admin.id, type: "admin" }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      admin.getRole().then(role => {
        res.status(200).send({
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: role.name,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

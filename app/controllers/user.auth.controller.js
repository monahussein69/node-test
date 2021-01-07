const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database

  Role.findOne({
    where: {
      name: "user"
    }
  })
    .then(role => {
      User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        roleId: role.id
      })
        .then(user => {
          var token = jwt.sign({ id: user.id, type: "user" }, config.secret, {
            expiresIn: 86400 // 24 hours
          });

          res.send({
            id: user.id,
            username: user.username,
            email: user.email,
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
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id, type: "user" }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      user.getRole().then(role => {
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          role: role.name,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const db = require("../models");
const Admin = db.admin;
const Role = db.role;

var bcrypt = require("bcryptjs");

exports.adminInfo = (req, res) => {
  Admin.findByPk(req.userId).then(user => {
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email
    });
  });
};

exports.addAdminHelps = (req, res) => {
  Admin.findByPk(req.userId)
    .then(user => {
      var roles = ["manager", "support", "sub-admin"];
      var index = roles.indexOf(req.body.role);
      if (index != -1) {
        Role.findOne({
          where: {
            name: req.body.role
          }
        }).then(role => {
          Admin.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            roleId: role.id,
            adminId: user.id
          })
            .then(adminHelper => {
              res.status(200).send({
                id: adminHelper.id,
                username: adminHelper.username,
                email: adminHelper.email
              });
            })
            .catch(err => {
              res.status(500).send({ message: err.message });
            });
        });
      } else {
        res
          .status(500)
          .send({ message: "Role must be manager or support or sub-admin" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAdminUsers = (req, res) => {
  Admin.findByPk(req.userId)
    .then(admin => {
      console.log(admin.adminId);
      if (admin.adminId) {
        Admin.findOne({
          where: {
            id: admin.adminId
          }
        }).then(adminForHelper => {
          adminForHelper.getUsers().then(users => {
            res.status(200).send(users);
          });
        });
      } else {
        admin.getUsers().then(users => {
          res.status(200).send(users);
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

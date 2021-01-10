const db = require("../models");
const Admin = db.admin;
const Role = db.role;

var bcrypt = require("bcryptjs");

const Op = db.Sequelize.Op;

exports.adminInfo = (req, res) => {
  Admin.findByPk(req.userId).then(user => {
    res.status(200).send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });
};

exports.getRoles = (req, res) => {
  Role.findAll({
    where: {
      name: {
        [Op.notIn]: ["admin", "user"]
      }
    }
  }).then(roles => {
    res.status(200).send({
      roles: roles
    });
  });
};

exports.getAdmins = (req, res) => {
  Admin.findAll({
    where: {
      roleId: 3
    }
  }).then(admins => {
    res.status(200).send({
      admins: admins
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
            .then(() => {
              res.status(200).send({
                message: "admin helper added successfully"
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
      if (admin.adminId) {
        Admin.findOne({
          where: {
            id: admin.adminId
          }
        }).then(adminForHelper => {
          adminForHelper.getUsers().then(users => {
            res.status(200).send({ users: users });
          });
        });
      } else {
        admin.getUsers().then(users => {
          res.status(200).send({
            users: users
          });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

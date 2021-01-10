const db = require("../models");
const User = db.user;
const Role = db.role;
const Admin = db.admin;

const Op = db.Sequelize.Op;

exports.userInfo = (req, res) => {
  User.findByPk(req.userId)
    .then(user => {
      var stores = [];
      user.getAdmins().then(admins => {
        for (let i = 0; i < admins.length; i++) {
          stores.push(admins[i].username.toUpperCase());
        }
        res.status(200).send({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            stores: stores
          }
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.subscribeToStore = (req, res) => {
  let token = req.headers["x-access-token"];
  User.findByPk(req.userId)
    .then(user => {
      if (req.body.stores && req.body.stores.length) {
        var stores_ids = req.body.stores.map(store => store.id);
        Role.findOne({
          where: {
            name: "admin"
          }
        })
          .then(role => {
            Admin.findAll({
              where: {
                id: {
                  [Op.in]: stores_ids
                },
                roleId: role.id
              }
            })
              .then(stores => {
                if (stores.length) {
                  user.hasAdmins(stores).then(result => {
                    if (result) {
                      res.status(200).send({
                        message: "User Already subscribe to stores!"
                      });
                    } else {
                      user
                        .addAdmins(stores)
                        .then(() => {
                          var stores = [];
                          user.getAdmins().then(admins => {
                            for (let i = 0; i < admins.length; i++) {
                              stores.push(admins[i].username.toUpperCase());
                            }

                            res.status(200).send({
                              message:
                                "User was subscribe to stores successfully!",
                              user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                role: "user",
                                accessToken: token,
                                stores: stores
                              }
                            });
                          });
                        })
                        .catch(err => {
                          res.status(500).send({ message: err.message });
                        });
                    }
                  });
                } else {
                  res.status(500).send({ message: "Some Stores not exist" });
                }
              })
              .catch(err => {
                res.status(500).send({ message: err.message });
              });
          })
          .catch(err => {
            res.status(500).send({ message: err.message });
          });
      } else {
        res.status(500).send({ message: "You have to add at least one store" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

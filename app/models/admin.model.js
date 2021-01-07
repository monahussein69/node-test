module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("admins", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    roleId: {
      type: Sequelize.INTEGER
    },
    adminId: {
      type: Sequelize.INTEGER
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return Admin;
};

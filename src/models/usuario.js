'use strict';

const Sequelize = require('sequelize');
const sequelize = require('../sequelize.config');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: Sequelize.STRING(500),
    allowNull: false
  },
  email: {
    type: Sequelize.STRING(100),
    validate: {
      isEmail: true,
    }
  },
  username: {
    type: Sequelize.STRING(20),
  },
  password: {
    type: Sequelize.STRING(100),
  },

  ativo: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  dataUltimoAcesso: {
    type: Sequelize.DATE,
  }

});

Usuario.sync();

module.exports = Usuario;

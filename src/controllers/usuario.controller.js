'use strict';

const Sequelize = require('sequelize');

const Usuario = require('../models/usuario');

const controller = require('./controller');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
  try {
    const filters = req.query;
    const query = controller.queryBase(Usuario, filters);
    const users = await Usuario.findAll({ where: query });

    res.successResult(users);
  } catch (e) {
    res.errorResult(e);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await Usuario.findById(id);

    res.successResult(user);
  } catch (e) {
    res.errorResult(e);
  }
};

exports.post = async (req, res, next) => {
  try {
    const data = req.body;
    data.password = await authService.setPassword(data.password);
    data = controller.transferTo(Usuario, data);

    const _usuario = await Usuario.create(data);

    res.successResult(_usuario);
  } catch (e) {
    res.errorResult(e);
  }
};

exports.put = async (req, res, next) => {
  try {

    const data = req.body;
    const id = data.id;
    const _usuario = await Usuario.findById(id);

    if (!_usuario)
      res.errorResult({}, 'Registro não encontrado!');

    if (data.password !== undefined)
      data.password = await authService.setPassword(data.password);

    _usuario = controller.transferTo(Usuario, data, _usuario);

    await _usuario.save();

    res.successResult(_usuario);
  } catch (e) {
    res.errorResult(e);
  }
};


exports.delete = async (req, res, next) => {
  try {
    const id = req.body.id;
    const user = await Usuario.findById(id);

    if (!user)
      res.errorResult({}, 'Usuário não encontrado!');

    await user.destroy();

    res.successResult(user);
  } catch (e) {
    res.errorResult(e);
  }
};

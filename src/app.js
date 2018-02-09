
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const winston = require('winston');

const indexRoute = require('./routes/index-route');
const authenticateRoute = require('./routes/authenticate.route');
const usuarioRoute = require('./routes/usuario.route');

const sequelize = require('./sequelize.config');

const app = express();

app.use(helmet());
app.use(compression());

app.use(bodyParser.json({
  limit: '5mb',
}));

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  res.errorResult = function (error, message, data) {
    return res.status(500).send({
      message: message || 'Falha ao processar sua requisição',
      data: data,
      error: error
    }).end();
  }

  res.successResult = function (data, message) {
    return res.status(200).send({
      message: message || 'Sucesso!',
      data: data
    });
  };

  next();
});

app.use('/', indexRoute);
app.use('/authenticate', authenticateRoute);
app.use('/usuario', usuarioRoute);

sequelize
  .authenticate()
  .then(() => {
    winston.info('Connection has been established successfully!');
  })
  .catch((err) => {
    winston.error(`Unable to connect to the database:${err}`);
  });

module.exports = app;

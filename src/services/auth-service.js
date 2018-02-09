const jwt = require('jsonwebtoken');
const md5 = require('md5')

global.SALT_KEY = 'f5b99242-6504-4ca3-90f2-05e78e5761ef';

exports.generateToken = async data => jwt.sign(data, global.SALT_KEY, { expiresIn: '1d' });

exports.decodeToken = async token => jwt.verify(token, global.SALT_KEY);

exports.setPassword = async password => md5(password, global.SALT_KEY);

exports.authorize = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    res.status(401).json({
      message: 'Acesso Restrito',
    });
  } else {
    jwt.verify(token, global.SALT_KEY, (error, decoded) => {
      if (error) {
        res.status(401).json({
          message: 'Token Inválido',
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    res.status(401).json({
      message: 'Token Inválido',
    });
  } else {
    jwt.verify(token, global.SALT_KEY, (error, decoded) => {
      if (error) {
        res.status(401).json({
          message: 'Token Inválido',
        });
      } else if (decoded.roles.includes('admin')) {
        next();
      } else {
        res.status(403).json({
          message: 'Esta funcionalidade é restrita para administradores',
        });
      }
    });
  }
};

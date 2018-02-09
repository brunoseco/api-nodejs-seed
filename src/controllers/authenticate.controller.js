
const authService = require('../services/auth-service')

const Usuario = require('../models/usuario')
const ValidationContract = require('../validators/fluent-validator')

exports.post = async (req, res) => {
  try {

    const username = req.body.username;
    const password = req.body.password;

    const contract = new ValidationContract();
    contract.isRequired(username, 'Usuário não enviado.');
    contract.isRequired(password, 'Senha não enviada.');

    if (!contract.isValid()) {
      res.errorResult(contract.errors());
      return;
    }

    const user = await Usuario.findOne({
      where: {
        username: username,
        password: await authService.setPassword(password),
        ativo: true
      }
    });

    if (!user) {
      res.status(404).send({
        message: 'Usuário ou senha inválidos.'
      }).end();
      return;
    }

    const token = await authService.generateToken(user.dataValues);

    user.dataUltimoAcesso = new Date();
    await user.save();

    res.status(200).send({
      token,
      data: user
    });

  } catch (e) {
    res.status(500).send({
      message: 'Falha ao processar sua requisição',
      error: e
    }).end();
  }
}

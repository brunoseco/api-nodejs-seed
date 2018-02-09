'use strict';

const Sequelize = require('sequelize');

function queryBase(model, filters) {
  var query = {};

  for (var propertyName in model.rawAttributes) {
    const prop = model.rawAttributes[propertyName]
    const field = prop.field;
    const type = prop.type.key;

    var value = filters[field];
    if (value !== undefined) {
      if (type == 'STRING')
        query[field] = { [Sequelize.Op.like]: '%' + value + '%' };
      else
        query[field] = value;
    }
  }
  return query;
}


function transferTo(model, data, alvo) {

  if (alvo === undefined)
    alvo = {};

  for (var propertyName in model.rawAttributes) {
    const prop = model.rawAttributes[propertyName]
    const field = prop.field;
    const type = prop.type.key;

    var value = data[field];
    if (value !== undefined) {
      alvo[field] = value;
    }
  }
  return alvo;
}

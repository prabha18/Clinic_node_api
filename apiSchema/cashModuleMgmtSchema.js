const Joi = require('@hapi/joi');

module.exports.listCashModuleJwt = Joi.object().keys({ 
    user_id: Joi.number().required(), 
  });
  module.exports.listCashModule = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
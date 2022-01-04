
const Joi = require('@hapi/joi');

//Check input schema
module.exports.fetchcommonDataJwt = Joi.object().keys({
  user_id: Joi.number().required(),
});
module.exports.fetchcommonData = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});
module.exports.fetchdoctorDataJwt = Joi.object().keys({
  user_id: Joi.number().required(), 
});
module.exports.fetchdoctorData = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});
module.exports.fetchpatientDataJwt = Joi.object().keys({
  user_id: Joi.number().required(), 
});
module.exports.fetchpatientData = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});
module.exports.fetchconsultationDataJwt = Joi.object().keys({
  user_id: Joi.number().required(), 
});
module.exports.fetchconsultationData = Joi.object().keys({
  jwtToken: Joi.string().required(), 
});
module.exports.bindCityDataJwt = Joi.object().keys({
  user_id: Joi.number().required(), 
});
module.exports.bindCityData = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});
module.exports.bindDoctorDataJwt = Joi.object().keys({
  user_id: Joi.number().required(),
});
module.exports.bindDoctorData = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

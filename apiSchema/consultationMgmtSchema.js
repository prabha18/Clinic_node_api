const Joi = require('@hapi/joi');

module.exports.createConsultationJwt = Joi.object().keys({ 
    consultation_id: Joi.number().required(), 
    appointment_id:Joi.number().required(), 
    employee_id: Joi.number().required(), 
    user_id: Joi.number().required(), 
    patient_id: Joi.number().required(),
    clinical_finding: Joi.string().allow(""),
    fees: Joi.number().allow(0),
    review_date: Joi.number().allow(0),
    appointment_status_id: Joi.number().required(), 
    paymentstatus_id: Joi.number().required(), 
    drug_allergy:Joi.string().allow(""),
    module_id:Joi.number().required(), 
    // drugsAllergy_Details:Joi.array().allow([]),
    diagnosis:Joi.array().allow([]),
  });

  module.exports.createConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.getDataConsultationJwt = Joi.object().keys({
    appointment_id: Joi.number().required(), 
  });
  module.exports.getDataConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.listConsultationJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    session_id: Joi.number().required(), 
  });
  module.exports.listConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadConsultationJwt = Joi.object().keys({
    consultation_id: Joi.number().required(), 
  });
  module.exports.editloadConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.clinicHistoryJwt = Joi.object().keys({
    patient_id: Joi.number().required(), 
  });
  module.exports.clinicHistory = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.previousConsultationJwt = Joi.object().keys({
    appointment_id: Joi.number().required(), 
    session_id: Joi.number().required(), 
  });
  module.exports.previousConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.nextConsultationJwt = Joi.object().keys({
    session_id: Joi.number().required(),
  });
  module.exports.nextConsultation = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.updatePaymentStatusJwt = Joi.object().keys({
    appointment_id: Joi.number().required(), 
    paymentstatus_id: Joi.number().required(), 
    fees: Joi.number().required(),
    ref_no: Joi.number().required(), 
    account_id:Joi.number().required(),
    transaction_id:Joi.number().required(),
    module_id:Joi.number().required(),
    voucher_no:Joi.string().required(),
    user_id:Joi.number().required(),
    narration:Joi.string().required().allow(""), 
  });
  module.exports.updatePaymentStatus = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  // module.exports.clinicalPhotographyJwt = Joi.object().keys({
  //   imageArray:Joi.array().required().allow([]),
  //   deleteArray:Joi.array().required().allow([]),
  //   patient_id: Joi.number().required(), 
  //   consultation_id: Joi.number().required(), 
  //   appointment_id: Joi.number().required(),
  //   user_id: Joi.number().required(),
  //   description_clinicalphotography:Joi.string().required().allow(""),
  // });
  module.exports.clinicalPhotography = Joi.object().keys({ 
    imageArray:Joi.array().required().allow([]),
    deleteArray:Joi.array().required().allow([]),
    patient_id: Joi.number().required(), 
    consultation_id: Joi.number().required(), 
    appointment_id: Joi.number().required(),
    user_id: Joi.number().required(),
    description_clinicalphotography:Joi.string().required().allow(""), 
  });
  module.exports.getConsultationclinicalImagesJwt = Joi.object().keys({
    consultation_id: Joi.number().required(), 
  });
  module.exports.getConsultationclinicalImages = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.getPatientclinicalImagesJwt = Joi.object().keys({
    patient_id: Joi.number().required(), 
  });
  module.exports.getPatientclinicalImages = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
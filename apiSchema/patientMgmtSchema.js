const Joi = require('@hapi/joi');

module.exports.createPatientJwt = Joi.object().keys({ 
    patient_id: Joi.number().required(), 
    patient_name: Joi.string().required(), 
    patient_code: Joi.number().allow(0),
    guardian_name:Joi.string().required(), 
    gender_id: Joi.number().required(), 
    date_of_birth: Joi.number().required().allow(0), 
    blood_group_id: Joi.number().required(), 
    street_name: Joi.string().allow(""), 
    area_name: Joi.string().allow(""), 
    city_id: Joi.number().required().allow(0),
    pincode:Joi.string().allow(""), 
    state_id: Joi.number().required(), 
    mobile_number: Joi.string().required(), 
    aadhar_number: Joi.string().allow(""), 
    occupation: Joi.string().allow(""), 
    dob_type: Joi.number().required(), 
    clinical_photography: Joi.number().allow(0),
    uhid:Joi.string().required(), 
    age_year: Joi.number().required().allow(0), 
    age_month: Joi.number().required().allow(0), 
    age_day: Joi.number().required().allow(0), 
    drug_allergy:Joi.string().allow(""), 
    user_id: Joi.number().required(), 
    active_status: Joi.number().required(), 
    city_name:Joi.string().allow(""),
    medicine_intake:Joi.array().allow([]),
    clinical_history:Joi.array().allow([]),
    tag_id:Joi.number().allow(0), 
    refered_by:Joi.string().required().allow(""), 
  });

  module.exports.createPatient = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.deletePatientJwt = Joi.object().keys({ 
    user_id: Joi.number().required(), 
    patient_id: Joi.number().required(), 
  });
  
  module.exports.deletePatient = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.listPatientJwt = Joi.object().keys({ 
    user_id: Joi.number().required(),
  });
  
  module.exports.listPatient = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadPatientJwt = Joi.object().keys({
    patient_id: Joi.number().required(),
  });
  module.exports.editloadPatient = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.getUHIDJwt = Joi.object().keys({ 
    user_id: Joi.number().required(),
  });
  
  module.exports.getUHID = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.patientDetailsearchJwt = Joi.object().keys({ 
    mobile_number: Joi.string().required(), 
    gender_id: Joi.number().required(), 
    date_of_birth: Joi.number().required().allow(0),
    patient_name: Joi.string().required(),
    patient_id: Joi.number().required(),
  });
  
  module.exports.patientDetailsearch = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
const Joi = require('@hapi/joi');

module.exports.createAppointmentJwt = Joi.object().keys({ 
    appointment_id: Joi.number().required(), 
    patient_id: Joi.number().required(), 
    user_id: Joi.number().required(), 
    employee_id:Joi.number().required(), 
    appointment_date: Joi.number().required(),
    tentative_time:Joi.number().allow(0), 
    token_number: Joi.number().required(), 
    appointment_type_id: Joi.number().required(), 
    appointment_mode_id: Joi.number().required(), 
    patient_category_id: Joi.number().required(), 
    fees: Joi.number().allow(0),
    remarks: Joi.string().allow(""), 
    session_id:Joi.number().required(), 
    height: Joi.number().required().allow(0),
    weight: Joi.number().required().allow(0),
    bmi: Joi.number().required().allow(0),
    cbg: Joi.number().required().allow(0),
    spo2: Joi.number().allow(0),
    blood_pressure:Joi.string().allow(""), 
    temparature: Joi.number().allow(0), 
    review_date: Joi.number().allow(0),
    module_id:Joi.number().required(), 
  });

  module.exports.createAppointment = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });


  module.exports.deleteAppointmentJwt = Joi.object().keys({  
    appointment_id: Joi.number().required(),
    user_id: Joi.number().required(),
  });
  
  module.exports.deleteAppointment = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.listAppointmentJwt = Joi.object().keys({ 
    user_id: Joi.number().required(),
    session_id: Joi.number().required(),
  });
  
  module.exports.listAppointment = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadAppointmentJwt = Joi.object().keys({
    appointment_id: Joi.number().required(),
  });
  module.exports.editloadAppointment = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.searchPatientsJwt = Joi.object().keys({
    search_Value: Joi.string().required(),
  });
  module.exports.searchPatients = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.createSessionJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    session_id: Joi.number().required(),
    start_time:Joi.number().required(),
    end_time:Joi.number().required(),
  });
  module.exports.createSession = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.getSessionidJwt = Joi.object().keys({ 
    user_id: Joi.number().required(),
  });
  
  module.exports.getSessionid = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.skipResumePatientJwt = Joi.object().keys({ 
    appointment_id: Joi.number().required(),
  });
  
  module.exports.skipResumePatient = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.getTokenJwt = Joi.object().keys({ 
    session_id: Joi.number().required(),
  });
  
  module.exports.getToken = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.getSessionsJwt = Joi.object().keys({ 
    start_time: Joi.number().required(),
  });
  
  module.exports.getSessions = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

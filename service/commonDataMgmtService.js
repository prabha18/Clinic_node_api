const commonService = require('../service/commonService')
const constants = require('../constants');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';
var setting = { ...constants.defaultSettings };
var loginStatus = { ...constants.loginStatus };
const logStreamName = 'userMgmtService';
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//create jwt 
module.exports.fetchcommonDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Fetch Commonlist
module.exports.fetchcommonData = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    if (req.jwtToken) {
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const city_Result = await client.query(`select city_id,city_name,active_status from tbl_def_city where active_status = 1`);
        const state_Result = await client.query(`select state_id,state_name,active_status from tbl_def_state where active_status = 1`);
        const status_Result = await client.query(`select status_name,status_id from tbl_def_status`);
        const gender_Result = await client.query(`select gender_name,gender_id from tbl_def_gender where active_status = 1`);
        const tag_Result = await client.query(`select tag_name,tag_id from tbl_def_tag where active_status = 1`);
        const employeecatery_Result = await client.query(`select employee_category_name,employee_category_id from tbl_def_employee_category where active_status = 1`);
        const userrole_Result = await client.query(`select userrole_id,userrole_name from tbl_userrole_master where active_status = 1`);
        const modules_Result = await client.query(`select module_id,module_name from tbl_def_modules where active_status = 1`);
        const feestype_Result = await client.query(`select fees_type_id,fees_type_name from tbl_def_fees_type where active_status = 1`);
        const feescollector_Result = await client.query(`select fees_collector_id,fees_collector_name from tbl_def_fees_collector where active_status = 1`);
        const feescollection_Result = await client.query(`select fees_collection_id,fees_collection_name from tbl_def_fees_collection where active_status = 1`);
        const referby = await client.query(`select distinct(refered_by) from tbl_patient where refered_by !=''`);
        const condition_Result = await client.query(`select condition_id,condition_name from tbl_def_condition where active_status = 1`);
        const agetype_Result = await client.query(`select age_type_id, age_type_name from tbl_def_agetype where active_status = 1`);
        const radiology_Result = await client.query(`select radiology_id, radiology_name,dependency from tbl_def_radiology_type where active_status = 1`);
        const radiologypart_Result = await client.query(`select radiology_part_id, radiology_part_name,radiology_id from tbl_def_radiology_parts where active_status = 1`);
        if (client) {
          client.end();
        }
        let City_Array = city_Result && city_Result.rows ? city_Result.rows : [];
        let state_Array = state_Result && state_Result.rows ? state_Result.rows : [];
        let status_Array = status_Result && status_Result.rows ? status_Result.rows : [];
        let gender_Array = gender_Result && gender_Result.rows ? gender_Result.rows : [];
        let tag_Array = tag_Result && tag_Result.rows ? tag_Result.rows : [];
        let employeecatery_Array = employeecatery_Result && employeecatery_Result.rows ? employeecatery_Result.rows : [];
        let modules_Array = modules_Result && modules_Result.rows ? modules_Result.rows : [];
        let userrole_Array = userrole_Result && userrole_Result.rows ? userrole_Result.rows : [];
        let feestype_Array = feestype_Result && feestype_Result.rows ? feestype_Result.rows : [];
        let feescollector_Array = feescollector_Result && feescollector_Result.rows ? feescollector_Result.rows : [];
        let feescollection_Array = feescollection_Result && feescollection_Result.rows ? feescollection_Result.rows : [];
        let refer_by = referby && referby.rows ? referby.rows : [];
        let condition_Array = condition_Result && condition_Result.rows ? condition_Result.rows : [];
        let agetype_Array = agetype_Result && agetype_Result.rows ? agetype_Result.rows : [];
        let radiologytype_Array = radiology_Result && radiology_Result.rows ? radiology_Result.rows : [];
        let radiologypart_Array = radiologypart_Result && radiologypart_Result.rows ? radiologypart_Result.rows : [];

        responseData = { "cityArray": City_Array, "stateArray": state_Array, "statusArray": status_Array, "genderArray": gender_Array, "tagArray": tag_Array, "employeecateryArray": employeecatery_Array, "userrole_Array": userrole_Array, "moduleArray": modules_Array, "feesTypeArray": feestype_Array, "feesCollectorArray": feescollector_Array, "feesCollectionArray": feescollection_Array, "referedbyArray": refer_by, "conditionArray": condition_Array, "agetypeArray": agetype_Array, "radiologyTypeArray": radiologytype_Array, "radiologyPartsArray": radiologypart_Array }
        if (responseData) {
          return responseData;
        }
        else {
          return '';
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  }

  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//create Doctor jwt 
module.exports.fetchdoctorDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Fetch Commonlist
module.exports.fetchdoctorData = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    if (req.jwtToken) {
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const qualification_Result = await client.query(`select distinct(qualification) from tbl_employee_master where qualification !=''`);
        const specialization_Result = await client.query(`select specialization_id,specialization,active_status from tbl_def_specialization where active_status = 1`);
        const designation_Result = await client.query(`select designation,designation_id from tbl_def_designation where active_status = 1`);
        const department_Result = await client.query(`select department_name,department_id from tbl_def_department where active_status = 1`);
        if (client) {
          client.end();
        }
        let qualification_Array = qualification_Result && qualification_Result.rows ? qualification_Result.rows : [];
        let specialization_Array = specialization_Result && specialization_Result.rows ? specialization_Result.rows : [];
        let designation_Array = designation_Result && designation_Result.rows ? designation_Result.rows : [];
        let department_Array = department_Result && department_Result.rows ? department_Result.rows : [];
        responseData = { "qualificationArray": qualification_Array, "specializationArray": specialization_Array, "designationArray": designation_Array, "departmentArray": department_Array }
        if (responseData) {
          return responseData;
        }
        else {
          return '';
        }
      }
      else {
        if (client) { client.end(); }
      }

    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  }

  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//create Patient jwt 
module.exports.fetchpatientDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Fetch patientlist
module.exports.fetchpatientData = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    if (req.jwtToken) {
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const bloodgroup_Result = await client.query(`select blood_group_id,blood_group_name,active_status from tbl_def_blood_group where active_status = 1`);
        const patientcategory_Result = await client.query(`select patient_category_id,patient_category_name,active_status from tbl_def_patient_category where active_status = 1`);
        if (client) {
          client.end();
        }
        let bloodgroup_Array = bloodgroup_Result && bloodgroup_Result.rows ? bloodgroup_Result.rows : [];
        let patientcategory_Array = patientcategory_Result && patientcategory_Result.rows ? patientcategory_Result.rows : [];
        responseData = { "bloodgroupArray": bloodgroup_Array, "patientcategoryArray": patientcategory_Array }
        if (responseData) {
          return responseData;
        }
        else {
          return '';
        }
      }
      else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  }

  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//create Consultation jwt 
module.exports.fetchconsultationDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//create Fetch consultationList
module.exports.fetchconsultationData = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    if (req.jwtToken) {
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const appointmenttype_Result = await client.query(`select appointment_type_id,appintment_type,active_status from tbl_def_appointment_type where active_status = 1`);
        const appointmentmode_Result = await client.query(`select appointment_mode_id,appointment_mode,active_status from tbl_def_appointment_mode where active_status = 1`);
        const appointmentstatus_Result = await client.query(`select appointment_status_id,appointment_status,active_status from tbl_def_appointment_status where active_status = 1`);
        const diagnosis_Result = await client.query(`select diagnosis_id,diagnosis_name,active_status from tbl_def_diagnosis where active_status = 1`);
        const paymentstatus_Result = await client.query(`select paymentstatus_id,paymentstatus_name,active_status from tbl_def_payment_status where active_status = 1`);
        const medicineintake_Result = await client.query(`select medicine_intake_id,intake_details,active_status from tbl_def_medicine_intake where active_status = 1`);
        const clinicalhistory_Result = await client.query(`select clinical_history_id,clinical_history_details,active_status from tbl_def_clinical_history where active_status = 1`);
        const consultingdoctor_Result = await client.query(`select employee_id,employee_name,active_status from tbl_employee_master where active_status = 1 and employee_category_id = 1`);
        if (client) {
          client.end();
        }
        let appointmenttype_Array = appointmenttype_Result && appointmenttype_Result.rows ? appointmenttype_Result.rows : [];
        let appointmentmode_Array = appointmentmode_Result && appointmentmode_Result.rows ? appointmentmode_Result.rows : [];
        let appointmentstatus_Array = appointmentstatus_Result && appointmentstatus_Result.rows ? appointmentstatus_Result.rows : [];
        let diagnosis_Array = diagnosis_Result && diagnosis_Result.rows ? diagnosis_Result.rows : [];
        let paymentstatus_Array = paymentstatus_Result && paymentstatus_Result.rows ? paymentstatus_Result.rows : [];
        let medicineintake_Array = medicineintake_Result && medicineintake_Result.rows ? medicineintake_Result.rows : [];
        let clinicalhistory_Array = clinicalhistory_Result && clinicalhistory_Result.rows ? clinicalhistory_Result.rows : [];
        let consultingdoctor_Array = consultingdoctor_Result && consultingdoctor_Result.rows ? consultingdoctor_Result.rows : [];
        responseData = { "appointmenttypeArray": appointmenttype_Array, "appointmentmodeArray": appointmentmode_Array, "appointmentstatusArray": appointmentstatus_Array, "diagnosisArray": diagnosis_Array, "paymentstatusArray": paymentstatus_Array, "medicineintakeArray": medicineintake_Array, "clinicalhistoryArray": clinicalhistory_Array, "consultingDoctorArray": consultingdoctor_Array }
        if (responseData) {
          return responseData;
        }
        else {
          return '';
        }
      }
      else {
        if (client) { client.end(); }
      }

    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//City jwt 
module.exports.bindCityDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//Bind City  
module.exports.bindCityData = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    if (req.jwtToken) {
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const city_Result = await client.query(`select city_id,city_name,active_status from tbl_def_city where active_status = 1`);
        if (client) {
          client.end();
        }
        let City_Array = city_Result && city_Result.rows ? city_Result.rows : [];
        responseData = { "cityArray": City_Array }
        if (responseData) {
          return responseData;
        }
        else {
          return '';
        }
      } else {
        if (client) { client.end(); }
      }
    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
//Doctor jwt 
module.exports.bindDoctorDataJwt = async (req) => {
  try {
    const token = await commonService.jwtCreate(req);
    return { token };

  } catch (error) {
    throw new Error(error);
  }
}
//Bind Doctor 
module.exports.bindDoctorData = async (req) => {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
  });
  await client.connect();
  try {
    if (req.jwtToken) {
      var responseData = {}
      const decoded = await commonService.jwtVerify(req.jwtToken);
      if (decoded) {
        const consultingdoctor_Result = await client.query(`select employee_id,employee_name,active_status from tbl_employee_master where active_status = 1 and employee_category_id = 1`);
        if (client) {
          client.end();
        }
        let consultingdoctor_Array = consultingdoctor_Result && consultingdoctor_Result.rows ? consultingdoctor_Result.rows : [];
        responseData = { "consultingDoctorArray": consultingdoctor_Array }
        if (responseData) {
          return responseData;
        }
        else {
          return '';
        }
      }
      else {
        if (client) { client.end(); }
      }

    } else {
      if (client) { client.end(); }
      throw new Error(constants.userMessage.TOKEN_MISSING);
    }
  } catch (error) {
    if (client) { client.end(); }
    throw new Error(error);
  }
  finally {
    if (client) { client.end(); }// always close the resource
  }
}
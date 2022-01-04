const commonService = require('../service/commonService')
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');

//create Patient jwt 
module.exports.createPatientJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//create Patient service
module.exports.createPatient = async (req) => {
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
            var response = {}
            const decoded = await commonService.jwtVerify(req.jwtToken);
            const { patient_id, patient_name, patient_code, guardian_name, gender_id, date_of_birth, blood_group_id, street_name, area_name, city_id, pincode, state_id, mobile_number, aadhar_number, occupation, dob_type, clinical_photography, uhid, age_year, age_month, age_day, drug_allergy, user_id, active_status, medicine_intake, clinical_history, city_name, tag_id, refered_by } = decoded.data;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            if (decoded) {
                var maxCity_Check = 0;
                const maxcity = await client.query(`select coalesce(max(city_id),0) + 1 as mr FROM tbl_def_city`)
                maxCity_Check = maxcity && maxcity.rows[0].mr;
                if (city_id == 0) {
                    await client.query(`INSERT INTO "tbl_def_city"("city_id","city_name","active_status") values ($1,initcap($2),$3) `, [maxCity_Check, city_name, 1]);
                }
                else { maxCity_Check = city_id }
                if (patient_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Patient");
                    const max = await client.query(`select coalesce(max(patient_id),0) + 1 as mr FROM tbl_patient`)
                    var maxpatient = max && max.rows[0].mr;
                    const create_result = await client.query(`INSERT INTO "tbl_patient"("patient_id","patient_name","patient_code","guardian_name","gender_id","date_of_birth","blood_group_id","street_name","area_name","city_id","pincode","state_id","mobile_number","aadhar_number","occupation","dob_type","clinical_photography","uhid","age_year","age_month","age_day","drug_allergy","active_status","maker_id","user_id","created_date","tag_id","refered_by") values ($1, Upper($2),$3,Upper($4),$5,$6,$7,initcap($8),initcap($9),$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28) `, [maxpatient, patient_name, patient_code, guardian_name, gender_id, date_of_birth, blood_group_id, street_name, area_name, maxCity_Check, pincode, state_id, mobile_number, aadhar_number, occupation, dob_type, clinical_photography, uhid, age_year, age_month, age_day, drug_allergy, active_status, makerid, user_id, createupdate_date, tag_id, refered_by]);
                    if (medicine_intake && medicine_intake.length > 0) {
                        for (let i = 0; i < medicine_intake.length; i++) {
                            const intake_max = await client.query(`select coalesce (max(patient_medicineintake_id),0) + 1 as mr FROM tblmedicine_intakedetails`)
                            var medicine_intake_max = intake_max && intake_max.rows[0].mr;
                            const intake_result = await client.query(`INSERT INTO "tblmedicine_intakedetails"("patient_medicineintake_id","patient_id","medicine_intake_id","status","intake_details","medicine_intake","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6, $7,$8,$9) `, [medicine_intake_max, maxpatient, medicine_intake[i].medicine_intake_id, medicine_intake[i].status, medicine_intake[i].intake_details, medicine_intake[i].medicine_intake, makerid, user_id, createupdate_date]);
                            let Intake_code = intake_result && intake_result.rowCount ? intake_result.rowCount : 0;
                            console.log(Intake_code, "Intake_code")
                        }
                    }
                    if (clinical_history && clinical_history.length > 0) {
                        for (let i = 0; i < clinical_history.length; i++) {
                            const history_max = await client.query(`select coalesce (max(patient_clinicalhistory_id),0) + 1 as mr FROM tblmedicine_clinicalhistory`)
                            var clinical_history_max = history_max && history_max.rows[0].mr;
                            const history_result = await client.query(`INSERT INTO "tblmedicine_clinicalhistory"("patient_clinicalhistory_id","patient_id","clinical_history_id","status","clinical_history_details","clinical_history","appointment_id","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10) `, [clinical_history_max, maxpatient, clinical_history[i].clinical_history_id, clinical_history[i].status, clinical_history[i].clinical_history_details, clinical_history[i].clinical_history, clinical_history[i].appointment_id, makerid, user_id, createupdate_date]);
                            let history_code = history_result && history_result.rowCount ? history_result.rowCount : 0;
                            console.log(history_code, "history_code")
                        }

                    }
                    let create_patient = create_result && create_result.rowCount ? create_result.rowCount : 0;
                    if (client) {
                        client.end();
                    }
                    if (create_patient == 1) {
                        response = { "patient_id": maxpatient, "message": constants.userMessage.USER_CREATED }
                        return response;
                    }
                    else { return '' }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Patient");
                    const count = await client.query(`select count(*) as count FROM tbl_patient where patient_id =` + patient_id)
                    var count_Check = count && count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_patient" set "patient_name"= Upper($1), "patient_code"=$2,"guardian_name"= Upper($3),"gender_id"=$4,"date_of_birth"=$5,"blood_group_id"=$6,"street_name"=initcap($7),"area_name"=initcap($8),"city_id"=$9,"pincode"=$10,"state_id"=$11,"mobile_number"=$12,"aadhar_number"=$13,"occupation"=$14,"dob_type"=$15,"clinical_photography"=$16,"uhid"=$17,"age_year"=$18,"age_month"=$19,"age_day"=$20,"drug_allergy"=$21,"active_status"=$22,"maker_id"=$23,"user_id"=$24,"updated_date"=$25,"tag_id"=$26,"refered_by"=$27 where "patient_id" = $28 `, [patient_name, patient_code, guardian_name, gender_id, date_of_birth, blood_group_id, street_name, area_name, maxCity_Check, pincode, state_id, mobile_number, aadhar_number, occupation, dob_type, clinical_photography, uhid, age_year, age_month, age_day, drug_allergy, active_status, makerid, user_id, createupdate_date, tag_id, refered_by, patient_id]);
                        await client.query(`DELETE FROM tblmedicine_intakedetails where patient_id=` + patient_id)
                        if (medicine_intake && medicine_intake.length > 0) {
                            for (let i = 0; i < medicine_intake.length; i++) {
                                const intake_max = await client.query(`select coalesce (max(patient_medicineintake_id),0) + 1 as mr FROM tblmedicine_intakedetails`)
                                var medicine_intake_max = intake_max && intake_max.rows[0].mr;
                                const intake_result = await client.query(`INSERT INTO "tblmedicine_intakedetails"("patient_medicineintake_id","patient_id","medicine_intake_id","status","intake_details","medicine_intake","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6, $7,$8,$9) `, [medicine_intake_max, patient_id, medicine_intake[i].medicine_intake_id, medicine_intake[i].status, medicine_intake[i].intake_details, medicine_intake[i].medicine_intake, makerid, user_id, createupdate_date]);
                                let Intake_code = intake_result && intake_result.rowCount ? intake_result.rowCount : 0;
                                console.log(Intake_code, "Intake_code")
                            }
                        }
                        await client.query(`DELETE FROM tblmedicine_clinicalhistory where patient_id=` + patient_id)
                        if (clinical_history && clinical_history.length > 0) {
                            for (let i = 0; i < clinical_history.length; i++) {
                                const history_max = await client.query(`select coalesce (max(patient_clinicalhistory_id),0) + 1 as mr FROM tblmedicine_clinicalhistory`)
                                var clinical_history_max = history_max && history_max.rows[0].mr;
                                console.log(clinical_history_max, "clinical_history_max")
                                const history_result = await client.query(`INSERT INTO "tblmedicine_clinicalhistory"("patient_clinicalhistory_id","patient_id","clinical_history_id","status","clinical_history_details","clinical_history","appointment_id","maker_id","user_id","created_date") values ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10) `, [clinical_history_max, patient_id, clinical_history[i].clinical_history_id, clinical_history[i].status, clinical_history[i].clinical_history_details, clinical_history[i].clinical_history, clinical_history[i].appointment_id, makerid, user_id, createupdate_date]);
                                let history_code = history_result && history_result.rowCount ? history_result.rowCount : 0;
                                console.log(history_code, "history_code")
                            }
                        }
                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (client) {
                            client.end();
                        }
                        if (update_code == 1) {
                            response = { "patient_id": patient_id, "message": constants.userMessage.USER_UPDATED }
                            return response;
                        }
                        else { return '' }
                    }
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
//Delete Patient jwt 
module.exports.deletePatientJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//Delete Patient service
module.exports.deletePatient = async (req) => {
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
            const decoded = await commonService.jwtVerify(req.jwtToken);
            const { patient_id, user_id } = decoded.data;
            if (decoded) {
                var response = {}
                await commonService.insertLogs(user_id, "Delete Patient");
                const appointmentcount = await client.query(`select count(*) as appointmentcount FROM tbl_appointment where patient_id =` + patient_id)
                var appointment_Check = appointmentcount && appointmentcount.rows[0].appointmentcount
                if (appointment_Check > 0) {
                    return response = { "message": constants.userMessage.PATIENT_NAME_CHECK, "status": false }
                }
                else {
                    const patient_Count = await client.query(`select count(*) as count FROM tbl_patient where patient_id =` + patient_id)
                    var count_Check = patient_Count && patient_Count.rows[0].count;
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        await client.query(`DELETE FROM tblmedicine_intakedetails where patient_id = $1 `, [patient_id]);
                        await client.query(`DELETE FROM tblmedicine_clinicalhistory where patient_id = $1 `, [patient_id]);
                        const delete_result = await client.query(`DELETE FROM tbl_patient where patient_id = $1 `,
                            [patient_id]);
                        if (client) {
                            client.end();
                        }
                        let patientcode = delete_result && delete_result.rowCount ? delete_result.rowCount : 0;
                        if (patientcode == 1) {
                            return response = { "message": constants.userMessage.USER_DELETED, "status": true }
                        }
                        else { return '' }
                    }
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
//List Patient jwt 
module.exports.listPatientJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//List Patient List
module.exports.listPatient = async (req) => {
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
            const decoded = await commonService.jwtVerify(req.jwtToken);
            if (decoded) {
                var response_Array = {}
                const list_Patient = await client.query(`Select a.patient_id,a.patient_name,a.guardian_name,a.gender_id,a.date_of_birth,a.blood_group_id,a.age_day,a.age_month,a.age_year,
                a.dob_type,a.active_status,a.city_id,a.mobile_number,a.tag_id,f.display_code,a.uhid,a.created_date,b.gender_name,c.blood_group_name,d.status_name,e.city_name,f.tag_name,case when (select count(patient_id) from tbl_appointment where patient_id=a.patient_id) > 0 then 0 else 1 end as deleteflag from tbl_patient as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_blood_group as c on a.blood_group_id=c.blood_group_id inner join tbl_def_status as d on a.active_status = d.status_id inner join tbl_def_city as e on a.city_id = e.city_id inner join tbl_def_tag as f on a.tag_id = f.tag_id ORDER BY a.patient_id DESC`);
                const totalvalue = await client.query('select count(*) as count from tbl_patient');
                const malevalue = await client.query('select count(*) as count from tbl_patient where gender_id = 1')
                const femalevalue = await client.query('select count(*) as count from tbl_patient where gender_id = 2')
                const othervalue = await client.query('select count(*) as count from tbl_patient where gender_id = 3')
                if (client) {
                    client.end();
                }
                var list_Patientarray = list_Patient && list_Patient.rows ? list_Patient.rows : [];
                var total_Count = totalvalue && totalvalue.rows[0].count ? totalvalue.rows[0].count : 0
                var male_Count = malevalue && malevalue.rows[0].count ? malevalue.rows[0].count : 0
                var female_Count = femalevalue && femalevalue.rows[0].count ? femalevalue.rows[0].count : 0
                var other_Count = othervalue && othervalue.rows[0].count ? othervalue.rows[0].count : 0
                response_Array = {
                    "patientArray": list_Patientarray, "total_Count": total_Count, "male_Count": male_Count, "female_Count": female_Count, "other_Count": other_Count
                }
                if (response_Array) {
                    return response_Array;
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
//Edit Patient jwt 
module.exports.editloadPatientJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//Edit Patient List
module.exports.editloadPatient = async (req) => {
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
            const decoded = await commonService.jwtVerify(req.jwtToken);
            const { patient_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                const edit_Patient = await client.query(`select a.patient_id,a.patient_name,a.patient_code,a.guardian_name,a.gender_id,a.date_of_birth,a.blood_group_id,a.street_name,a.area_name,a.active_status,a.city_id,a.pincode,a.state_id,a.mobile_number,a.aadhar_number,a.occupation,a.uhid,a.created_date,a.dob_type,a.clinical_photography,a.age_year,a.age_month,a.age_day,a.drug_allergy,a.tag_id,h.display_code,a.refered_by,b.gender_name,h.tag_name,c.blood_group_name,d.status_name,e.city_name,f.state_name from tbl_patient as a inner join tbl_def_gender as b on a.gender_id = b.gender_id inner join tbl_def_blood_group as c on a.blood_group_id=c.blood_group_id inner join tbl_def_status as d on a.active_status = d.status_id inner join tbl_def_city as e on a.city_id =e.city_id inner join tbl_def_state as f on a.state_id = f.state_id inner join tbl_def_tag as h on a.tag_id = h.tag_id where a.patient_id = ` + patient_id);

                const medicineintake = await client.query(`select a.patient_medicineintake_id,a.patient_id,a.medicine_intake_id,a.status,a.medicine_intake,a.intake_details,b.intake_details as def_intake_details from tblmedicine_intakedetails  as a inner join tbl_def_medicine_intake as b on a.medicine_intake_id = b.medicine_intake_id where patient_id =` + patient_id)
                const clinical_history = await client.query(`select a.patient_clinicalhistory_id,a.patient_id,a.clinical_history_id,a.status,a.clinical_history_details,a.clinical_history,b.clinical_history_details as def_historydetails from tblmedicine_clinicalhistory as a  inner join tbl_def_clinical_history as b on a.clinical_history_id = b.clinical_history_id where patient_id =` + patient_id)
                if (client) {
                    client.end();
                }
                let edit_Patientarray = edit_Patient && edit_Patient.rows ? edit_Patient.rows : [];
                let edit_medicineintake = medicineintake && medicineintake.rows ? medicineintake.rows : [];
                let edit_clinicalhistory = clinical_history && clinical_history.rows ? clinical_history.rows : [];
                response_Array = {
                    "PatientArray": edit_Patientarray, "MedicineintakeArray": edit_medicineintake, "ClinicalhistoryArray": edit_clinicalhistory
                }
                if (response_Array) {
                    return response_Array;
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

//Uhid Patient Jwt
module.exports.getUHIDJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}

//Uhid Patient
module.exports.getUHID = async (req) => {
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
            const decoded = await commonService.jwtVerify(req.jwtToken);
            if (decoded) {
                var response_Array = {}
                const getUHID = await client.query(`select a.company_code||to_char(to_date(CURRENT_DATE::text, 'YYYY'), 'YY')||date_part('month', CURRENT_DATE)||(LPAD((select  coalesce (max(patient_id),0) + 1 as ref from tbl_patient)::text,4,'0')) as uhid from tbl_account_master as a  inner join tbl_account_module as b on a.account_id = b.account_id where b.module_id = 2`);
                if (client) {
                    client.end();
                }
                if (getUHID.rows.length > 0) {
                    const uhid = getUHID && getUHID.rows[0].uhid;
                    return response_Array = { "UHID": uhid, "status": true }
                }
                else {
                    return response_Array = { "message": constants.userMessage.ACCOUNTDETAILSMISSING, "status": false }
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
//patient search Jwt
module.exports.patientDetailsearchJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//patient search
module.exports.patientDetailsearch = async (req) => {
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
            const decoded = await commonService.jwtVerify(req.jwtToken);
            const { mobile_number, date_of_birth, gender_id, patient_name, patient_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                var condition = `LOWER ("patient_name") = LOWER ( ` + "'" + patient_name + "')"

                const patientcount = await client.query(`select count(*) as patientcount FROM tbl_patient where ` + ` "mobile_number" = '` + mobile_number + `' and gender_id = ` + gender_id + ` and ` + condition + `  and date_of_birth =  ` + date_of_birth + ` and  patient_id !=` + patient_id);
                if (client) {
                    client.end();
                }

                var patient_Check = patientcount && patientcount.rows[0].patientcount
                if (patient_Check > 0) {
                    return response = { "message": constants.userMessage.DUPLICATE_PATIENT, "status": false }
                }

                return response = { "message": constants.userMessage.UNIQUE_PATIENT, "status": true }

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
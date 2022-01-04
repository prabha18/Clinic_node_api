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

//create Consultation jwt 
module.exports.createConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//create Consultation service
module.exports.createConsultation = async (req) => {
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
            const { consultation_id, appointment_id, employee_id, patient_id, user_id, clinical_finding, fees, review_date, drug_allergy, diagnosis, appointment_status_id, paymentstatus_id, module_id } = decoded.data;
            var response = {}
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            var create_date = new Date().getTime();
            if (decoded) {
                // var message = {}
                // var getAccountId = await commonService.getAccountId(module_id);
                // var account_id = getAccountId.account_id;
                // var account_status = getAccountId.status
                // var account_message = getAccountId.message
                // var voucherid = await commonService.getVoucherId(module_id);
                // var voucher_id = voucherid.voucher_id;
                // var voucher_status = voucherid.status;
                // var voucher_message = voucherid.message;
                // var financial_year_id = voucherid.financial_year_id

                // if (account_status == true) {
                // if (voucher_status == true) {
                if (consultation_id == 0) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Consultation");
                    const max = await client.query(`select coalesce(max(consultation_id),0) + 1 as mr FROM tbl_consultation`)
                    var maxconsultation = max && max.rows[0].mr;
                    const create_result = await client.query(`INSERT INTO "tbl_consultation"("consultation_id","appointment_id","employee_id","patient_id","clinical_finding","fees","review_date","maker_id","user_id","created_date") values ($1, $2, $3,$4,$5,$6,$7,$8,$9,$10) `, [maxconsultation, appointment_id, employee_id, patient_id, clinical_finding, fees, review_date, makerid, user_id, create_date]);

                    await client.query(`UPDATE "tbl_patient" set "drug_allergy"=$1 where "patient_id" = $2 `, [drug_allergy, patient_id]);

                    await client.query(`UPDATE "tbl_appointment" set "paymentstatus_id"=$1,"fees"=$2 where "appointment_id" = $3`, [paymentstatus_id, fees, appointment_id]);

                    // await client.query(`INSERT INTO "tbl_transaction"("transaction_id","employee_id","patient_id","module_id","paymentstatus_id","total_amount","active_status","maker_id","user_id","created_date",ref_no,created_time,"account_id","voucher_no","financial_year_id") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`, [maxtransaction_id, employee_id, patient_id, module_id, paymentstatus_id, fees, 1, makerid, user_id, createupdate_date, appointment_id, create_date, account_id, voucher_id,financial_year_id]);


                    // if (drugsAllergy_Details && drugsAllergy_Details.length > 0) {
                    //     for (let i = 0; i < drugsAllergy_Details.length; i++) {
                    //         const allergy_max = await client.query(`select coalesce (max(drugsallergy_id),0) + 1 as mr FROM tbl_drugsallergy`)
                    //         var drugsallergy_max = allergy_max && allergy_max.rows[0].mr;
                    //         const drugsallergyresult = await client.query(`INSERT INTO "tbl_drugsallergy"("drugsallergy_id","drugsallergy","patient_id","consultation_id","created_date") values ($1, $2, $3, $4,$5) `, [drugsallergy_max, drugsAllergy_Details[i].drugsallergy, patient_id, maxconsultation, createupdate_date]);
                    //         let drugsallergy_code = drugsallergyresult && drugsallergyresult.rowCount ? drugsallergyresult.rowCount : 0;
                    //         console.log(drugsallergy_code)
                    //     }
                    // }
                    if (diagnosis && diagnosis.length > 0) {
                        for (let i = 0; i < diagnosis.length; i++) {
                            var maxdiagnosis_Check = 0;
                            const maxdiagnosis = await client.query(`select coalesce(max(diagnosis_id),0) + 1 as max FROM tbl_def_diagnosis`)
                            maxdiagnosis_Check = maxdiagnosis && maxdiagnosis.rows[0].max;
                            if (diagnosis[i].diagnosis_id == 0) {
                                await client.query(`INSERT INTO "tbl_def_diagnosis"("diagnosis_id","diagnosis_name","active_status") values ($1, $2,$3) `, [maxdiagnosis_Check, diagnosis[i].diagnosis_name, 1]);
                            }
                            else { maxdiagnosis_Check = diagnosis[i].diagnosis_id }
                            const diagnosis_max = await client.query(`select coalesce (max(patient_diagnosis_id),0) + 1 as mr FROM tbl_diagnosis`)
                            var diagnosis_maxcheck = diagnosis_max && diagnosis_max.rows[0].mr;
                            const diagnosisresult = await client.query(`INSERT INTO "tbl_diagnosis"("patient_diagnosis_id","patient_id","appointment_id","consultation_id","diagnosis_id","created_date") values ($1, $2, $3, $4,$5,$6) `, [diagnosis_maxcheck, patient_id, appointment_id, maxconsultation, maxdiagnosis_Check, createupdate_date]);
                            let diagnosis_code = diagnosisresult && diagnosisresult.rowCount ? diagnosisresult.rowCount : 0;
                            console.log(diagnosis_code)
                        }
                    }
                    var id = await commonService.insertLogs(user_id, "Update Appointment");
                    await client.query(`UPDATE "tbl_appointment" set "appointment_status_id"=$1,"paymentstatus_id"=$2,"fees"=$3,"review_date"=$4,"updated_date"=$5,"maker_id"=$6,"user_id"=$7 where "appointment_id" = $8 `, [appointment_status_id, paymentstatus_id, fees, review_date, createupdate_date, id, user_id, appointment_id]);
                    let create_consultation = create_result && create_result.rowCount ? create_result.rowCount : 0;
                    if (create_consultation == 1) {
                        const list_cash = await client.query(`select a.transaction_id,a.employee_id,a.patient_id,a.module_id,a.total_amount,a.paymentstatus_id,a.ref_no,a.voucher_no,a.account_id,a.created_time,b.patient_name,c.company_name,c.company_code,d.module_name,e.paymentstatus_name from tbl_transaction as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_account_master as c on a.account_id = c.account_id inner join tbl_def_modules as d on a.module_id = d.module_id inner join tbl_def_payment_status as e on a.paymentstatus_id = e.paymentstatus_id where a.ref_no =$1`, [appointment_id]);
                        if (client) {
                            client.end();
                        }
                        let list_casharray = list_cash && list_cash.rows ? list_cash.rows : [];
                        return response = { "consultation_id": maxconsultation, "message": constants.userMessage.USER_UPDATED, "listCasharray": list_casharray, "status": true };
                    }
                    else {
                        if (client) {
                            client.end();
                        } return ''
                    }
                }
                else {
                    var makerid = await commonService.insertLogs(user_id, "Update Consultation");
                    const consultation_Count = await client.query(`select count(*) as count FROM tbl_consultation where consultation_id =` + consultation_id)
                    var count_Check = consultation_Count && consultation_Count.rows[0].count
                    if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                        const update_result = await client.query(`UPDATE "tbl_consultation" set "appointment_id"=$1, "employee_id"=$2,"patient_id"=$3,"clinical_finding"=$4,"fees"=$5,"maker_id"=$6,"review_date"=$7,"user_id"=$8,"updated_date"=$9 where "consultation_id" = $10 `, [appointment_id, employee_id, patient_id, clinical_finding, fees, makerid, review_date, user_id, createupdate_date, consultation_id]);

                        await client.query(`UPDATE "tbl_patient" set "drug_allergy"=$1 where "patient_id" = $2 `, [drug_allergy, patient_id]);

                        await client.query(`UPDATE "tbl_appointment" set "paymentstatus_id"=$1,"fees"=$2 where "appointment_id" = $3`, [paymentstatus_id, fees, appointment_id]);

                        await client.query(`UPDATE "tbl_transaction" set "paymentstatus_id"=$1,"total_amount"=$2 where "ref_no" = $3`, [paymentstatus_id, fees, appointment_id]);
                        // await client.query(`DELETE FROM tbl_drugsallergy where consultation_id=` + consultation_id + `and patient_id =` + patient_id)
                        // if (drugsAllergy_Details && drugsAllergy_Details.length > 0) {
                        //     for (let i = 0; i < drugsAllergy_Details.length; i++) {
                        //         const allergy_max = await client.query(`select coalesce (max(drugsallergy_id),0) + 1 as mr FROM tbl_drugsallergy`)
                        //         var drugsallergy_max = allergy_max && allergy_max.rows[0].mr;
                        //         const drugsallergyresult = await client.query(`INSERT INTO "tbl_drugsallergy"("drugsallergy_id","drugsallergy","patient_id","consultation_id","created_date") values ($1, $2, $3, $4,$5) `, [drugsallergy_max, drugsAllergy_Details[i].drugsallergy, patient_id, consultation_id, createupdate_date]);
                        //         let drugsallergy_code = drugsallergyresult && drugsallergyresult.rowCount ? drugsallergyresult.rowCount : 0;
                        //         console.log(drugsallergy_code)
                        //     }
                        // }
                        await client.query(`DELETE FROM tbl_diagnosis where consultation_id=` + consultation_id + `and patient_id =` + patient_id)
                        if (diagnosis && diagnosis.length > 0) {
                            for (let i = 0; i < diagnosis.length; i++) {
                                var maxdiagnosis_Check = 0;
                                const maxdiagnosis = await client.query(`select coalesce(max(diagnosis_id),0) + 1 as max FROM tbl_def_diagnosis`)
                                maxdiagnosis_Check = maxdiagnosis && maxdiagnosis.rows[0].max;
                                if (diagnosis[i].diagnosis_id == 0) {
                                    await client.query(`INSERT INTO "tbl_def_diagnosis"("diagnosis_id","diagnosis_name","active_status") values ($1, $2,$3) `, [maxdiagnosis_Check, diagnosis[i].diagnosis_name, 1]);
                                }
                                else { maxdiagnosis_Check = diagnosis[i].diagnosis_id }
                                const diagnosis_max = await client.query(`select coalesce (max(patient_diagnosis_id),0) + 1 as mr FROM tbl_diagnosis`)
                                var diagnosis_maxcheck = diagnosis_max && diagnosis_max.rows[0].mr;
                                const diagnosisresult = await client.query(`INSERT INTO "tbl_diagnosis"("patient_diagnosis_id","patient_id","appointment_id","consultation_id","diagnosis_id","created_date") values ($1, $2, $3, $4,$5,$6) `, [diagnosis_maxcheck, patient_id, appointment_id, consultation_id, maxdiagnosis_Check, createupdate_date]);
                                let diagnosis_code = diagnosisresult && diagnosisresult.rowCount ? diagnosisresult.rowCount : 0;
                                console.log(diagnosis_code)
                            }
                        }
                        var id = await commonService.insertLogs(user_id, "Update Appointment");
                        await client.query(`UPDATE "tbl_appointment" set "appointment_status_id"=$1,"paymentstatus_id"=$2,"fees"=$3,"review_date"=$4,"updated_date"=$5,"maker_id"=$6,"user_id"=$7 where "appointment_id" = $8 `, [appointment_status_id, paymentstatus_id, fees, review_date, createupdate_date, id, user_id, appointment_id]);
                        let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                        if (update_code == 1) {
                            const list_cash = await client.query(`select a.transaction_id,a.employee_id,a.patient_id,a.module_id,a.total_amount,a.paymentstatus_id,a.ref_no,a.voucher_no,a.account_id,a.created_time,b.patient_name,c.company_name,c.company_code,d.module_name,e.paymentstatus_name from tbl_transaction as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_account_master as c on a.account_id = c.account_id inner join tbl_def_modules as d on a.module_id = d.module_id inner join tbl_def_payment_status as e on a.paymentstatus_id = e.paymentstatus_id where a.ref_no =$1`, [appointment_id]);
                            if (client) {
                                client.end();
                            }
                            let list_casharray = list_cash && list_cash.rows ? list_cash.rows : [];
                            return response = { "consultation_id": consultation_id, "message": constants.userMessage.USER_UPDATED, "listCasharray": list_casharray, "status": true };
                        }
                        else { return '' }
                    }
                }
                // }
                // else {
                //     return message = { "message": voucher_message, "status": voucher_status }
                // }
                // }
                // else {
                //     return message = { "message": account_message, "status": account_status }
                // }
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
//Get Consultation jwt 
module.exports.getDataConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//Get Consultation List
module.exports.getDataConsultation = async (req) => {
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
            const { appointment_id } = decoded.data
            if (decoded) {
                var response_Data = {}
                const get_Data = await client.query(`select a.appointment_id,a.employee_id,a.patient_id,a.appointment_date,a.token_number,a.appointment_type_id,a.appointment_mode_id,a.patient_category_id,a.fees,a.remarks,a.height,a.session_id,a.paymentstatus_id,a.weight,a.spo2,a.blood_pressure,a.temparature,a.bmi,a.cbg,b.patient_name,b.patient_code,b.tag_id,i.display_code,b.gender_id,b.date_of_birth,b.blood_group_id,b.uhid,b.drug_allergy,b.age_day,b.age_month,b.age_year,b.dob_type,b.clinical_photography,c.gender_name,d.blood_group_name,f.appintment_type,e.appointment_mode,g.patient_category_name,h.paymentstatus_name,i.tag_name from tbl_appointment as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_def_gender as c on b.gender_id = c.gender_id inner join tbl_def_blood_group as d on b.blood_group_id=d.blood_group_id inner join tbl_def_appointment_type as f on a.appointment_type_id=f.appointment_type_id inner join tbl_def_appointment_mode as e on a.appointment_mode_id = e.appointment_mode_id inner join tbl_def_patient_category as g on a.patient_category_id = g.patient_category_id inner join tbl_def_payment_status as h on a.paymentstatus_id = h.paymentstatus_id inner join tbl_def_tag as i on b.tag_id = i.tag_id  where a.appointment_id =` + appointment_id);
                const medicineintake = await client.query(`select a.patient_medicineintake_id,a.patient_id,a.medicine_intake_id,a.status,a.medicine_intake,a.intake_details,b.intake_details as def_intake_details from tblmedicine_intakedetails  as a inner join tbl_def_medicine_intake as b on a.medicine_intake_id = b.medicine_intake_id where patient_id =(select patient_id from tbl_appointment where appointment_id = $1 limit 1)`, [appointment_id])
                const clinical_history = await client.query(`select a.patient_clinicalhistory_id,a.patient_id,a.clinical_history_id,a.status,a.clinical_history_details,a.clinical_history,b.clinical_history_details as def_historydetails from tblmedicine_clinicalhistory as a  inner join tbl_def_clinical_history as b on a.clinical_history_id = b.clinical_history_id where patient_id =(select patient_id from tbl_appointment where appointment_id = $1 limit 1)`, [appointment_id])
                if (client) {
                    client.end();
                }
                let get_Datararray = get_Data && get_Data.rows ? get_Data.rows : [];
                let edit_medicineintake = medicineintake && medicineintake.rows ? medicineintake.rows : [];
                let edit_clinicalhistory = clinical_history && clinical_history.rows ? clinical_history.rows : [];
                // let edit_drugsallergy = drugsallergy && drugsallergy.rows ? drugsallergy.rows : [];
                // "Drugsallergy": edit_drugsallergy
                response_Data = {
                    "ConsultationArray": get_Datararray, "MedicineintakeArray": edit_medicineintake, "ClinicalhistoryArray": edit_clinicalhistory
                }
                if (response_Data) {
                    return response_Data;
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
//List Consultation jwt 
module.exports.listConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//List Consultation 
module.exports.listConsultation = async (req) => {
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
            const { session_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                var date = new Date();
                var milliseconds = date.setHours(0, 0, 0, 0);
                const List_Data = await client.query(`SELECT derv.* from(select a.tentative_time,a.token_number,a.appointment_status_id,a.patient_id,a.appointment_id,a.appointment_date,a.appointment_mode_id,a.employee_id,a.paymentstatus_id,b.consultation_id,COALESCE(b.fees,A.fees) AS fees,COALESCE(b.created_date,a.appointment_date) as created_date,a.session_id,i.appointment_mode,c.clinical_photography,c.patient_name,c.tag_id,j.display_code,c.uhid,c.gender_id,c.date_of_birth,c.blood_group_id,c.age_day,c.age_month,c.age_year,c.dob_type,c.city_id,c.mobile_number,d.employee_name,e.appointment_status,f.paymentstatus_name,j.tag_name,k.gender_name,l.blood_group_name,m.city_name,n.transaction_id,n.ref_no,n.voucher_no,n.account_id,n.created_time,n.module_id,n.total_amount as transaction_rate,case when a.appointment_status_id = 2 then 1 when a.appointment_status_id = 3 then 2 when a.appointment_status_id = 1 then 3 when a.appointment_status_id = 4 then 4 end as ordernumber from tbl_appointment as a left outer join  tbl_consultation as b on a.appointment_id = b.appointment_id inner join tbl_patient as c on a.patient_id = c.patient_id inner join tbl_employee_master as d on a.employee_id = d.employee_id inner join tbl_def_appointment_status as e on a.appointment_status_id = e.appointment_status_id inner join tbl_def_payment_status as f on a.paymentstatus_id = f.paymentstatus_id inner join tbl_def_appointment_mode as i on a.appointment_mode_id = i.appointment_mode_id inner join tbl_def_tag as j on c.tag_id = j.tag_id inner join tbl_def_gender as k on c.gender_id = k.gender_id inner join tbl_def_blood_group as l on c.blood_group_id=l.blood_group_id inner join tbl_def_city as m on c.city_id = m.city_id left outer join tbl_transaction as n on a.appointment_id = n.ref_no ) as derv where module_id = 2 order by ordernumber,token_number asc`);

                const consultation_status = await client.query(`SELECT a.appointment_status_id,appointment_status,count(b.*) from tbl_def_appointment_status as a left join 
                tbl_appointment as b on a.appointment_status_id=b.appointment_status_id and b.session_id = $1
                  group by a.appointment_status_id,a.appointment_status `, [session_id])

                const totalAmount = await client.query(`select SUM(a.fees) as count from tbl_consultation as a inner join tbl_appointment as b on a.appointment_id = b.appointment_id where a.created_date = ` + milliseconds + ` and b.session_id = ` + session_id + ` and b.paymentstatus_id = 1 `)

                // const currentvalue = await client.query(`select token_number from  (select max(session_id)  as token_number from tbl_appointment where appointment_status_id = 2 order by token_number asc limit 1) as temp`)
                const currentvalue = await client.query(`select COALESCE(max(COALESCE(token_number,0))+1,1) as token_number from tbl_appointment where session_id = ` + session_id)

                const totalvalue = await client.query(`select count(*) as count from tbl_appointment`);
                if (client) {
                    client.end();
                }
                let List_array = List_Data && List_Data.rows ? List_Data.rows : [];
                var total_Count = totalvalue && totalvalue.rows[0].count ? totalvalue.rows[0].count : 0
                if (consultation_status && consultation_status.rows.length > 0) {
                    var status = consultation_status.rows
                    for (let i = 0; i < status.length; i++) {
                        if (status[i].appointment_status_id == 1) {
                            consulted_Count = status[i].count;
                        }
                        if (status[i].appointment_status_id == 2) {
                            queue_Count = status[i].count;
                        }
                        if (status[i].appointment_status_id == 3) {
                            skipped_Count = status[i].count;
                        }
                    }
                }

                var total_Amount = totalAmount && totalAmount.rows[0].count ? totalAmount.rows[0].count : 0
                var current_Token = currentvalue && currentvalue.rows[0] ? currentvalue.rows[0] : 0
                response_Array = {
                    "ConsultationArray": List_array, "total_Count": total_Count, "consulted_Count": consulted_Count, "queue_Count": queue_Count, "current_Token": current_Token, "skipped_Count": skipped_Count, "total_Amount": total_Amount,
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
//Editload Consultation jwt 
module.exports.editloadConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//Editload Consultation List
module.exports.editloadConsultation = async (req) => {
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
            const { consultation_id } = decoded.data
            if (decoded) {
                var response_Data = {}
                const editload_Data = await client.query(`select a.consultation_id,a.appointment_id,a.patient_id,a.review_date,a.fees,a.clinical_finding,a.employee_id,b.paymentstatus_id,b.appointment_date,b.token_number,b.appointment_type_id,b.appointment_mode_id,b.patient_category_id,b.remarks,b.height,b.weight,b.spo2,b.session_id,b.blood_pressure,b.temparature,b.bmi,b.cbg,c.patient_name,c.patient_code,c.tag_id,i.display_code,c.gender_id,c.date_of_birth,c.blood_group_id,c.uhid,c.drug_allergy,c.age_day,c.age_month,c.age_year,c.dob_type,c.clinical_photography,d.gender_name,h.blood_group_name,f.appintment_type,e.appointment_mode,g.patient_category_name, t.paymentstatus_name,i.tag_name from tbl_consultation as a inner join tbl_appointment as b on a.appointment_id = b.appointment_id inner join tbl_patient as c on a.patient_id = c.patient_id inner join tbl_def_gender as d on c.gender_id = d.gender_id inner join tbl_def_blood_group as h on c.blood_group_id=h.blood_group_id inner join tbl_def_appointment_type as f on b.appointment_type_id=f.appointment_type_id inner join tbl_def_appointment_mode as e on b.appointment_mode_id = e.appointment_mode_id inner join tbl_def_patient_category as g on b.patient_category_id = g.patient_category_id inner join tbl_def_payment_status as t on b.paymentstatus_id = t.paymentstatus_id inner join tbl_def_tag as i on c.tag_id = i.tag_id where a.consultation_id =` + consultation_id);
                const diagnosis = await client.query(`select a.patient_diagnosis_id,a.patient_id,a.diagnosis_id,b.diagnosis_name from tbl_diagnosis as a inner join tbl_def_diagnosis as b on a.diagnosis_id = b.diagnosis_id where consultation_id =` + consultation_id)

                const medicineintake = await client.query(`select a.patient_medicineintake_id,a.patient_id,a.medicine_intake_id,a.status,a.medicine_intake,a.intake_details,b.intake_details as def_intake_details from tblmedicine_intakedetails  as a inner join tbl_def_medicine_intake as b on a.medicine_intake_id = b.medicine_intake_id where patient_id =(select patient_id from tbl_consultation where consultation_id = $1 limit 1)`, [consultation_id])
                const clinical_history = await client.query(`select a.patient_clinicalhistory_id,a.patient_id,a.clinical_history_id,a.status,a.clinical_history_details,a.clinical_history,b.clinical_history_details as def_historydetails from tblmedicine_clinicalhistory as a  inner join tbl_def_clinical_history as b on a.clinical_history_id = b.clinical_history_id where patient_id =(select patient_id from tbl_consultation where consultation_id = $1 limit 1)`, [consultation_id])
                // const drugsallergy = await client.query(`select drugsallergy_id,patient_id,drugsallergy from tbl_drugsallergy  where  consultation_id =` + consultation_id)
                if (client) {
                    client.end();
                }
                let editload_Datararray = editload_Data && editload_Data.rows ? editload_Data.rows : [];
                let edit_diagnosis = diagnosis && diagnosis.rows ? diagnosis.rows : [];
                let edit_medicineintake = medicineintake && medicineintake.rows ? medicineintake.rows : [];
                let edit_clinicalhistory = clinical_history && clinical_history.rows ? clinical_history.rows : [];
                // let edit_drugsallergy = drugsallergy && drugsallergy.rows ? drugsallergy.rows : [];
                // "Drugsallergy": edit_drugsallergy
                response_Data = {
                    "ConsultationArray": editload_Datararray, "DiagnosisArray": edit_diagnosis, "MedicineintakeArray": edit_medicineintake, "ClinicalhistoryArray": edit_clinicalhistory
                }
                if (response_Data) {
                    return response_Data;
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
//Clinic History  jwt 
module.exports.clinicHistoryJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Clinic History 
module.exports.clinicHistory = async (req) => {
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
            const { patient_id } = decoded.data
            if (decoded) {
                var response = {}
                const Clinicalhistory_data = await client.query(`select a.patient_id,a.clinical_finding,b.appointment_date,b.tentative_time,b.height,b.weight,b.spo2,b.blood_pressure,b.bmi,b.cbg,b.temparature,b.session_id,c.patient_name,c.drug_allergy from tbl_consultation  as a inner join tbl_appointment as b on a.patient_id = b.patient_id inner join tbl_patient as c on a.patient_id = c.patient_id where a.patient_id = ` + patient_id);
                const diagnosis = await client.query(`select a.patient_diagnosis_id,a.patient_id,a.diagnosis_id,b.diagnosis_name from tbl_diagnosis as a inner join tbl_def_diagnosis as b on a.diagnosis_id = b.diagnosis_id where a.patient_id =` + patient_id)
                if (client) {
                    client.end();
                }
                var Clinicalhistoryarray = Clinicalhistory_data && Clinicalhistory_data.rows ? Clinicalhistory_data.rows : [];
                var diagnosisarray = diagnosis && diagnosis.rows ? diagnosis.rows : [];
                response = {
                    "ClinicalHistoryArray": Clinicalhistoryarray, "DiagnosisArray": diagnosisarray
                }
                if (response) {
                    return response;
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
//Previous Consultation  jwt 
module.exports.previousConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Previous Consultation List
module.exports.previousConsultation = async (req) => {
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
            const { appointment_id, session_id } = decoded.data
            if (decoded) {
                var appointmentid = appointment_id - 1
                var previous_response = {}
                const previous_Count = await client.query(`select count(*) as previouscount FROM tbl_appointment where appointment_id =` + appointment_id)
                var previous_Check = previous_Count && previous_Count.rows[0].previouscount
                if (previous_Check != 0 && previous_Check != null && previous_Check != undefined && previous_Check != "") {
                    const previous_Data = await client.query(`select a.appointment_id,a.employee_id,a.patient_id,a.appointment_date,a.token_number,a.session_id,a.appointment_type_id,a.appointment_mode_id,a.appointment_status_id,a.patient_category_id,a.fees,a.remarks,a.height,a.bmi,a.cbg,a.paymentstatus_id,a.weight,a.spo2,a.blood_pressure,a.temparature,b.patient_name,b.patient_code,b.clinical_photography,b.gender_id,b.tag_id,j.display_code,b.date_of_birth,b.blood_group_id,b.uhid,b.drug_allergy,c.gender_name,d.blood_group_name,f.appintment_type,e.appointment_mode,g.patient_category_name,h.paymentstatus_name,i.appointment_status,j.tag_name from tbl_appointment as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_def_gender as c on b.gender_id = c.gender_id inner join tbl_def_blood_group as d on b.blood_group_id=d.blood_group_id inner join tbl_def_appointment_type as f on a.appointment_type_id=f.appointment_type_id inner join tbl_def_appointment_mode as e on a.appointment_mode_id = e.appointment_mode_id inner join tbl_def_patient_category as g on a.patient_category_id = g.patient_category_id inner join tbl_def_payment_status as h on a.paymentstatus_id = h.paymentstatus_id inner join tbl_def_appointment_status as i on a.appointment_status_id = i.appointment_status_id inner join tbl_def_tag as j on b.tag_id = j.tag_id where a.session_id =` + session_id + `and a.appointment_status_id = 1 and a.appointment_id < ` + appointment_id + `limit 1`);
                    if (client) {
                        client.end();
                    }
                    let previous_Datararray = previous_Data && previous_Data.rows ? previous_Data.rows : [];
                    if (previous_Datararray.length > 0) {
                        return previous_response = { "AppointmentData": previous_Datararray, "message": constants.userMessage.LIST_CREATED, "status": true };
                    }
                    else {
                        return previous_response = { "message": constants.userMessage.NORECORDFOUND, "status": false };
                    }
                }
                else {
                    return previous_response = { "message": constants.userMessage.NORECORDFOUND, "status": false };
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
//Next Consultation  jwt 
module.exports.nextConsultationJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Next Consultation List
module.exports.nextConsultation = async (req) => {
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
            const { session_id } = decoded.data
            if (decoded) {
                var next_response = {}
                const next_Data = await client.query(`select a.appointment_id,a.employee_id,a.patient_id,a.appointment_date,a.token_number,a.appointment_type_id,a.appointment_mode_id,a.appointment_status_id,a.patient_category_id,a.fees,a.session_id,a.remarks,a.height,a.bmi,a.cbg,a.paymentstatus_id,a.weight,a.spo2,a.blood_pressure,a.temparature,b.patient_name,b.patient_code,b.gender_id,b.date_of_birth,b.blood_group_id,b.tag_id,j.display_code,b.uhid,b.drug_allergy,b.clinical_photography,c.gender_name,d.blood_group_name,f.appintment_type,e.appointment_mode,g.patient_category_name,h.paymentstatus_name,i.appointment_status,j.tag_name from tbl_appointment as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_def_gender as c on b.gender_id = c.gender_id inner join tbl_def_blood_group as d on b.blood_group_id=d.blood_group_id inner join tbl_def_appointment_type as f on a.appointment_type_id=f.appointment_type_id inner join tbl_def_appointment_mode as e on a.appointment_mode_id = e.appointment_mode_id inner join tbl_def_patient_category as g on a.patient_category_id = g.patient_category_id inner join tbl_def_payment_status as h on a.paymentstatus_id = h.paymentstatus_id inner join tbl_def_appointment_status as i on a.appointment_status_id = i.appointment_status_id
                inner join tbl_def_tag as j on b.tag_id = j.tag_id  where a.session_id =` + session_id + ` and a.appointment_status_id = 2 order by a.appointment_id asc limit 1`);

                if (client) {
                    client.end();
                }
                let next_Datararray = next_Data && next_Data.rows ? next_Data.rows : [];
                if (next_Datararray.length > 0) {
                    return next_response = { "AppointmentData": next_Datararray, "message": constants.userMessage.LIST_CREATED, "status": true };
                }
                else {
                    return next_response = { "message": constants.userMessage.NORECORDFOUND, "status": false };
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
//Update payment jwt 
module.exports.updatePaymentStatusJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Update payment service
module.exports.updatePaymentStatus = async (req) => {
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
            const { appointment_id, paymentstatus_id, fees, account_id, transaction_id, ref_no, module_id, voucher_no, narration, user_id } = decoded.data;
            var update_code = 0;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            var create_date = new Date().getTime();
            var financialId = await commonService.getFinancial_year();
            var financial_year_id = financialId.financial_year_id;
            var financialyear_status = financialId.status
            var financialyear_message = financialId.message
            if (decoded) {
                if (financialyear_status == true) {
                    var makerid = await commonService.insertLogs(user_id, "Insert Cash Module");
                    if (paymentstatus_id == 1) {
                        const max = await client.query(`select coalesce(max(cash_id),0) + 1 as mr FROM tbl_cash_transaction`)
                        var maxcash = max && max.rows[0].mr;
                        await client.query(`INSERT INTO "tbl_cash_transaction"("cash_id","transaction_id","account_id","module_id","voucher_no","financial_year","cash_rate","narration","created_time","ref_no","maker_id","user_id","created_date") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, [maxcash, transaction_id, account_id, module_id, voucher_no, financial_year_id, fees, narration, create_date, transaction_id, makerid, user_id, createupdate_date]);
                    }
                    else {
                        const cashcount = await client.query(`select count(*) FROM tbl_cash_transaction where ref_no = $1`, [ref_no])
                        var count_Check = cashcount && cashcount.rows[0].count
                        if (count_Check.length > 0) {
                            await client.query(`Delete from tbl_cash_transaction where ref_no = $1`, [ref_no])
                        }
                    }
                    if (module_id == 2) {

                        await client.query(`UPDATE "tbl_transaction" set "paymentstatus_id"=$1,"total_amount"= $2 where "ref_no" = $3 and module_id = $4`, [paymentstatus_id, fees, ref_no, module_id]);
                        await client.query(`UPDATE "tbl_consultation" set "updated_date"=$1,"fees"= $2 where "appointment_id" = $3`, [createupdate_date, fees, appointment_id]);
                        var update_result = await client.query(`UPDATE "tbl_appointment" set "paymentstatus_id"=$1,"updated_date"=$2,"fees"= $3 where "appointment_id" = $4 `, [paymentstatus_id, createupdate_date, fees, appointment_id]);
                        update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    }
                    if (module_id == 4) {
                        await client.query(`UPDATE "tbl_transaction" set "paymentstatus_id"=$1,"total_amount"= $2 where "ref_no" = $3  and module_id =$4`, [paymentstatus_id, fees, ref_no, module_id]);

                        var update_result = await client.query(`UPDATE "tbl_patient_lab_details" set "paymentstatus_id"=$1,"updated_date"=$2,"lab_rate"= $3 where "appointment_id" = $4 `, [paymentstatus_id, createupdate_date, fees, appointment_id]);
                        update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    }

                    if (client) {
                        client.end();
                    }
                    if (update_code == 1) {
                        return constants.userMessage.USER_UPDATED;
                    }
                    else { return '' }
                }
                else {
                    return financialyear_message
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
// //clinical Photography Jwt
// module.exports.clinicalPhotographyJwt = async (req) => {
//     try {
//         const token = await commonService.jwtCreate(req);
//         return { token };
//     } catch (error) {
//         throw new Error(error);
//     }
// }
//clinical Photography service
module.exports.clinicalPhotography = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        // if (req.jwtToken) {
        //     const decoded = await commonService.jwtVerify(req.jwtToken);
        const { imageArray, patient_id, consultation_id, appointment_id, user_id, description_clinicalphotography, deleteArray } = req;
        var fs = require('fs');
        var direction = './images/clinical_photography/' + consultation_id;
        if (!fs.existsSync(direction)) {
            fs.mkdirSync(direction);
        }
        else {
            if (deleteArray && deleteArray.length > 0) {
                for (let i = 0; i < deleteArray.length; i++) {
                    await this.remove_file(direction, consultation_id, deleteArray[i]);
                }
            }
        }
        if (imageArray && imageArray.length > 0) {
            var image_array = imageArray
            for (let i = 0; i < image_array.length; i++) {
                await this.insert_image(direction, i, imageArray[i], patient_id, consultation_id, appointment_id, user_id, description_clinicalphotography)
            }
        }
        await client.query(`UPDATE "clinical_photography" set "description_clinicalphotography"=$1 where "consultation_id" = $2 `, [description_clinicalphotography, consultation_id]);
        if (client) {
            client.end();
        }
        return constants.userMessage.USER_UPLOAD;
    }

    // } 
    catch (error) {
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
module.exports.remove_file = async function (direction, consultation_id, deleteArray) {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        var fs = require('fs');
        const path = require('path');
        if (fs.existsSync(direction + '/' + deleteArray.fileName)) {
            fs.unlink(direction + '/' + deleteArray.fileName, async (err) => {
                if (err) throw err;
                // if no error, file has been deleted successfully
                else {
                    console.log('File deleted!');
                    await client.query(`DELETE FROM clinical_photography where image_name = $1 and consultation_id = $2`, [deleteArray.fileName, consultation_id])
                    if (client) { client.end(); }
                }
            });
        } else {
            console.log("DOES NOT exist:");
        }
        // await fs.readdir(direction, async (err, files) => {
        //     if (err) throw err;
        //     for (const file of files) {
        //         fs.unlink(path.join(direction, file), async (err) => {
        //             if (err) throw err;
        //             else {
        //                 await client.query(`DELETE FROM clinical_photography where consultation_id=` + consultation_id)
        //                 if (client) { client.end(); }
        //             }
        //         });
        //     }
        // });
        return;
    } catch (error) {
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
module.exports.insert_image = async function (direction, i, imageArray, patient_id, consultation_id, appointment_id, user_id, description_clinicalphotography) {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        var fs = require('fs');
        var makerid = await commonService.insertLogs(user_id, "Insert clinicalPhotography");
        var createupdate_date = new Date().setHours(0, 0, 0, 0);
        var time_stemp = new Date().getTime();
        var dataString = imageArray.fileArray;
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        await fs.writeFile(direction + '/' + patient_id + '_' + consultation_id + '_' + time_stemp + '_' + [i + 1] + '_' + imageArray.fileName, response.data, function (err) {
            console.log("The file was saved!");
        })
        const image_max = await client.query(`select coalesce (max(image_id),0) + 1 as mr FROM clinical_photography`)
        var imageid = image_max && image_max.rows[0].mr;
        await client.query(`INSERT INTO "clinical_photography"("consultation_id","appointment_id","patient_id","image_id","image_name","description_clinicalphotography","user_id","maker_id","created_date") values ($1,$2,$3,$4,$5,$6,$7,$8,$9) `, [consultation_id, appointment_id, patient_id, imageid, patient_id + '_' + consultation_id + '_' + time_stemp + '_' + [i + 1] + '_' + imageArray.fileName, description_clinicalphotography, user_id, makerid, createupdate_date]);
    } catch (error) {
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Consultation clinicalImages jwt 
module.exports.getConsultationclinicalImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Consultation clinicalImages service
module.exports.getConsultationclinicalImages = async (req) => {
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
            const { consultation_id } = decoded.data;
            if (decoded) {
                const image_result = await client.query(`SELECT consultation_id,appointment_id,patient_id,image_id,image_name,description_clinicalphotography from clinical_photography where "consultation_id" = $1 `, [consultation_id]);
                let list_imagearray = image_result && image_result.rows ? image_result.rows : [];
                if (client) {
                    client.end();
                }
                if (list_imagearray) {
                    return list_imagearray;
                }
                else { return '' }
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
//Patient clinicalImages jwt 
module.exports.getPatientclinicalImagesJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Consultation clinicalImages service
module.exports.getPatientclinicalImages = async (req) => {
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
                const image_result = await client.query(`SELECT a.consultation_id,a.appointment_id,a.patient_id,a.image_id,a.image_name,a.description_clinicalphotography,row_number() OVER (ORDER BY b.created_date DESC),b.created_date from clinical_photography as a inner join tbl_consultation as b on a.consultation_id = b.consultation_id where a.patient_id = $1 `, [patient_id]);
                let list_imagearray = image_result && image_result.rows ? image_result.rows : [];
                if (client) {
                    client.end();
                }
                if (list_imagearray) {
                    return list_imagearray;
                }
                else { return '' }
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
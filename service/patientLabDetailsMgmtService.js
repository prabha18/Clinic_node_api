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

//Create Patient lab test jwt 
module.exports.createPatientLabtestJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Create Patient lab test service
module.exports.createPatientLabtest = async (req) => {
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
            const { lab_patient_id, employee_id, appointment_id, patient_id, module_id, lab_rate, paymentstatus_id, active_status, user_id, employee_testArray } = decoded.data;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            var create_date = new Date().getTime();
            if (decoded) {
                var message = {}
                var getAccountId = await commonService.getAccountId(module_id);
                var account_id = getAccountId.account_id;
                var account_status = getAccountId.status
                var account_message = getAccountId.message
                var voucherid = await commonService.getVoucherId(module_id);
                var voucher_id = voucherid.voucher_id;
                var voucher_status = voucherid.status;
                var voucher_message = voucherid.message;
                var financial_year_id = voucherid.financial_year_id
                const maxtransaction = await client.query(`select coalesce(max(transaction_id),0) + 1 as transaction FROM tbl_transaction`)
                var maxtransaction_id = maxtransaction && maxtransaction.rows[0].transaction;
                if (account_status == true) {
                    if (voucher_status == true) {
                        if (lab_patient_id == 0) {
                            var makerid = await commonService.insertLogs(user_id, "Insert Patient Lab");
                            const max = await client.query(`select coalesce(max(lab_patient_id),0) + 1 as mr FROM tbl_patient_lab_details`)
                            var maxtab_id = max && max.rows[0].mr;
                            const create_result = await client.query(`INSERT INTO "tbl_patient_lab_details"("lab_patient_id","employee_id","patient_id","appointment_id","lab_rate","paymentstatus_id","active_status","maker_id","user_id","created_date","module_id") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) `, [maxtab_id, employee_id, patient_id, appointment_id, lab_rate, paymentstatus_id, active_status, makerid, user_id, createupdate_date, module_id]);
                            if (employee_testArray && employee_testArray.length > 0) {
                                for (let i = 0; i < employee_testArray.length; i++) {
                                    const labtest_max = await client.query(`select coalesce (max(lab_test_id),0) + 1 as mr FROM tbl_employee_lab_test`)
                                    var maxlab_test_id = labtest_max && labtest_max.rows[0].mr;
                                    const Labtestresult = await client.query(`INSERT INTO "tbl_employee_lab_test"("lab_test_id","employee_id","patient_id","group_id","test_id","lab_patient_id","test_rate","group_rate") values ($1, $2, $3, $4, $5,$6,$7,$8) `, [maxlab_test_id, employee_id, patient_id, employee_testArray[i].group_id, employee_testArray[i].test_id, maxtab_id, employee_testArray[i].test_rate, employee_testArray[i].group_rate]);
                                    let LabTest_code = Labtestresult && Labtestresult.rowCount ? Labtestresult.rowCount : 0;
                                    console.log(LabTest_code)
                                }
                            }
                            await client.query(`INSERT INTO "tbl_transaction"("transaction_id","employee_id","patient_id","module_id","paymentstatus_id","total_amount","active_status","maker_id","user_id","created_date",ref_no,created_time,"account_id","voucher_no","financial_year_id") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`, [maxtransaction_id, employee_id, patient_id, module_id, paymentstatus_id, maxtab_id, 1, makerid, user_id, createupdate_date, maxlab_test_id, create_date, account_id, voucher_id, financial_year_id]);

                            if (client) {
                                client.end();
                            }
                            let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
                            if (create_usercode == 1) {
                                message = { "message":  constants.userMessage.USER_CREATED, "status": true }
                                return message
                            }
                            else { return '' }
                        }
                        else {
                            var makerid = await commonService.insertLogs(user_id, "Update Transaction");
                            const lab_Count = await client.query(`select count(*) as count FROM tbl_patient_lab_details where lab_patient_id =` + lab_patient_id)
                            var count_Check = lab_Count && lab_Count.rows[0].count
                            if (count_Check != 0 && count_Check != null && count_Check != undefined && count_Check != "") {
                                const update_result = await client.query(`UPDATE "tbl_patient_lab_details" set "employee_id"= $1,"patient_id"=$2,"appointment_id"=$3,"paymentstatus_id"= $4,"lab_rate"=$5,"active_status"=$6,"maker_id"=$7,"user_id"=$8,"updated_date"=$9,"module_id"=$10 where "lab_patient_id" = $11 `, [employee_id, patient_id, appointment_id, paymentstatus_id, lab_rate, active_status, makerid, user_id, createupdate_date, module_id, lab_patient_id]);
                                if (employee_testArray && employee_testArray.length > 0) {
                                    await client.query(`DELETE FROM tbl_employee_lab_test where lab_patient_id=$1`,
                                        [lab_patient_id])
                                    for (let i = 0; i < employee_testArray.length; i++) {
                                        const labtest_max = await client.query(`select coalesce (max(lab_test_id),0) + 1 as mr FROM tbl_employee_lab_test`)
                                        var maxlab_test_id = labtest_max && labtest_max.rows[0].mr;
                                        const Labtestresult = await client.query(`INSERT INTO "tbl_employee_lab_test"("lab_test_id","employee_id","patient_id","group_id","test_id","lab_patient_id","test_rate","group_rate") values ($1, $2, $3, $4,$5,$6,$7,$8) `, [maxlab_test_id, employee_id, patient_id, employee_testArray[i].group_id, employee_testArray[i].test_id, lab_patient_id, employee_testArray[i].test_rate, employee_testArray[i].group_rate]);
                                        let LabTest_code = Labtestresult && Labtestresult.rowCount ? Labtestresult.rowCount : 0;
                                        console.log(LabTest_code)
                                    }
                                }

                                await client.query(`UPDATE "tbl_transaction" set "paymentstatus_id"=$1,"total_amount"=$2 where "ref_no" = $3`, [paymentstatus_id, lab_rate, lab_patient_id]);
                                if (client) {
                                    client.end();
                                }
                                let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                                if (update_code == 1) {
                                    message = { "message":  constants.userMessage.USER_UPDATED, "status": true }
                                    return message
                                }
                                else { return '' }
                            }
                        }
                    }
                    else {
                        return message = { "message": voucher_message, "status": voucher_status }
                    }
                }
                else {
                    return message = { "message": account_message, "status": account_status }
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
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Edit Patient lab test jwt 
module.exports.editloadPatientLabDetailsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Edit Patient lab test List
module.exports.editloadPatientLabDetails = async (req) => {
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
            const { lab_patient_id } = decoded.data;
            if (decoded) {
                const edit_Labtest = await client.query(`select a.lab_patient_id,a.employee_id,a.patient_id,a.appointment_id,a.lab_rate,a.paymentstatus_id,a.module_id,e.module_name,b.group_id,b.test_id,c.group_name,c.rate as group_rate,d.test_name,d.rate as test_rate from tbl_patient_lab_details as a inner join tbl_employee_lab_test as b on a.lab_patient_id = b.lab_patient_id inner join tbl_lab_test_group_master as c on b.group_id = c.group_id inner join tbl_lab_test_master as d on b.test_id = d.test_id inner join tbl_def_modules as e on a.module_id = e.module_id where a.lab_patient_id = $1 `, [lab_patient_id]);
                if (client) {
                    client.end();
                }
                let edit_Labtestarray = edit_Labtest && edit_Labtest.rows ? edit_Labtest.rows : [];
                if (edit_Labtestarray) {
                    return edit_Labtestarray;
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
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//Get PaymentStatus jwt 
module.exports.getPaymentStatusJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//Get PaymentStatus 
module.exports.getPaymentStatus = async (req) => {
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
            const { appointment_id } = decoded.data;
            if (decoded) {
                var response_Array = {}
                const get_Status = await client.query(`select a.paymentstatus_id,b.paymentstatus_name,a.lab_patient_id FROM tbl_patient_lab_details as a inner join tbl_def_payment_status as b on a.paymentstatus_id = b.paymentstatus_id where a.appointment_id = $1 `, [appointment_id]);
                if (client) {
                    client.end();
                }
                let get_Statusarray = get_Status && get_Status.rows ? get_Status.rows : [];
                response_Array = { "paymentStatus": get_Statusarray }
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
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}
//load Test Details jwt 
module.exports.loadTestDetailsJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//load Test Details
module.exports.loadTestDetails = async (req) => {
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
            const { lab_patient_id } = decoded.data;
            if (decoded) {
                const get_Labtest = await client.query(`select a.lab_patient_id,a.employee_id,a.patient_id,a.appointment_id,a.lab_rate,a.paymentstatus_id,a.module_id,e.module_name,b.group_id,b.group_rate as group_rate,b.test_rate as test_rate,b.test_id,c.group_name,d.test_name from tbl_patient_lab_details as a inner join tbl_employee_lab_test as b on a.lab_patient_id = b.lab_patient_id inner join tbl_lab_test_group_master as c on b.group_id = c.group_id inner join tbl_lab_test_master as d on b.test_id = d.test_id inner join tbl_def_modules as e on a.module_id = e.module_id  where a.lab_patient_id = $1`, [lab_patient_id]);
                if (client) {
                    client.end();
                }
                let load_Labtestarray = get_Labtest && get_Labtest.rows ? get_Labtest.rows : [];
                if (load_Labtestarray) {
                    return load_Labtestarray;
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
    } finally {
        if (client) { client.end(); }// always close the resource
    }
}

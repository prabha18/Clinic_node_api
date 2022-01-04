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

//list CashModule jwt 
module.exports.listCashModuleJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };

    } catch (error) {
        throw new Error(error);
    }
}
//list CashModule List
module.exports.listCashModule = async (req) => {
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
          const list_cash = await client.query(`select a.transaction_id,a.employee_id,a.patient_id,a.module_id,a.total_amount,a.paymentstatus_id,a.ref_no,a.voucher_no,a.account_id,a.created_time,a.created_date,b.patient_name,b.uhid,c.company_name,c.company_code,d.module_name,e.paymentstatus_name,g.narration from tbl_transaction as a inner join tbl_patient as b on a.patient_id = b.patient_id inner join tbl_account_master as c on a.account_id = c.account_id inner join tbl_def_modules as d on a.module_id = d.module_id inner join tbl_def_payment_status as e on a.paymentstatus_id = e.paymentstatus_id left outer join tbl_cash_transaction as g on a.transaction_id = g. transaction_id`);
          if (client) {
            client.end();
          }
          let list_casharray = list_cash && list_cash.rows ? list_cash.rows : [];
          if (list_casharray) {
            return list_casharray;
          }
          else {
            return '';
          }
        }
        else{
          if (client) {client.end();}
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
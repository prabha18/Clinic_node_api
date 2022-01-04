/****************************
 Developed by : Shiva Software Solutions
 File    : commonService.js
 Date    : 19-11-2021
 Purpose : commonService 
 * ********************** */

const constants = require('../constants');
const jwt = require('jsonwebtoken');
const connectionString = require('../database/connection');
const crypto = require('crypto');
var algorithm = 'aes-256-ctr';
var password = 'd6F3Efeq';
//Connect Postgres
const { Client } = require('pg');
//Verify JWT Token
module.exports.jwtVerify = async function (jwtToken) {
  try {
    const token = jwtToken.trim();
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'my-secret-key');
    return decoded;
  } catch (error) {
    console.log('Something went wrong: Service: jwtVerify', error);
    throw new Error(error);
  }
}

//Create JWT Token 
module.exports.jwtCreate = async function (data) {
  try {
    const token = jwt.sign({ data }, process.env.SECRET_KEY || 'my-secret-key', { expiresIn: '3h' });
    return token;
  } catch (error) {
    console.log('Something went wrong: Service: jwtVerify', error);
    throw new Error(error);
  }
}

//insert userlog 
module.exports.insertLogs = async function (user_code, originator ) {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
});
await client.connect();
  try {   
    var create_date = new Date().setHours(0,0,0);
    const result = await client.query(`INSERT INTO "tbluserlog"("user_code","originator","created_date") values ($1, $2, $3) RETURNING "log_id"  `,
    [user_code,originator,create_date]); 
    if(client){
      client.end(); 
    } 
    return result.rows[0].log_id;
  } catch (error) {
    if(client){
      client.end(); 
    }   
    console.log('Something went wrong: Service: checkUserId', error);
    throw new Error(error);
  }
}

//Decrypt password
module.exports.decryptpassword = async function ({ pwd }) {
  try {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(pwd, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  } catch (error) {
    throw new Error(error);
  }
}


//Encrypt password
module.exports.encryptpassword = async function ({pwd}) {
  try {
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(pwd,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  } catch (error) {
    throw new Error(error);
  }
}

//Get AccountId
module.exports.getAccountId = async function (module_id) {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
});
await client.connect();
  try {   
    var response ={}
    const result = await client.query(`select account_id from tbl_account_module where module_id = $1 `,
    [module_id]); 
    if(client){
      client.end(); 
    } 
    if(result.rows.length > 0){
      response = {"account_id":result.rows[0].account_id,"status":true}
    }
    else{
      response = {"message":constants.userMessage.ACCOUNTDETAILSMISSING,"status":false}
    }
    return response;
  } catch (error) {
    if(client){
      client.end(); 
    }   
    throw new Error(error);
  }
}

//Get VoucherId
module.exports.getVoucherId = async function (module_id) {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
});
await client.connect();
  try {
    var response={}   
    const count_year = await client.query(`SELECT financial_year_id FROM tbl_financial_year WHERE to_char(to_timestamp (extract(epoch from now())*1000/1000.0),'YYYY/mm/dd') BETWEEN to_char(to_timestamp (start_date/1000.0),'YYYY/mm/dd') and to_char(to_timestamp (end_date/1000.0),'YYYY/mm/dd') limit 1`); 
    if(count_year.rows.length > 0){
      const financial_year_id  = count_year && count_year.rows[0].financial_year_id
      console.log(module_id,"module_id")
      const VoucherId = await client.query(`select a.prefix||to_char(to_date(CURRENT_DATE::text, 'YYYY'), 'YY')||date_part('month', CURRENT_DATE)||(LPAD((SELECT count(*)+1 from tbl_transaction where module_id = $1 and financial_year_id = $2)::text,a.noofdigit,'0')) || a.suffix as voucher from tbl_financial_setting as a where module_id = $1 and financial_year_id= $2`,[module_id,financial_year_id]);
      if(client){
        client.end(); 
      } 
      if(VoucherId.rows.length > 0){
        var voucher_id  = VoucherId && VoucherId.rows[0].voucher 
        response = {"voucher_id":voucher_id,"financial_year_id":financial_year_id,"status":true}
        return response;
      }
      else{
        response = {"message":constants.userMessage.FINANCIAL_MISSING,"status":false}
        return response;
      }
    }
    else{
      response = {"message":constants.userMessage.FINANCIAL_MISSING,"status":false}
      return response;
    }
  } catch (error) {
    if(client){
      client.end(); 
    }   
    throw new Error(error);
  }
}

//Get financial_year
module.exports.getFinancial_year = async function () {
  const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
});
await client.connect();
  try {  
    const financialyear = await client.query(`SELECT financial_year_id FROM tbl_financial_year  WHERE to_char(to_timestamp (extract(epoch from now())*1000/1000.0),'YYYY/mm/dd') BETWEEN to_char(to_timestamp (start_date/1000.0),'YYYY/mm/dd') and to_char(to_timestamp (end_date/1000.0),'YYYY/mm/dd') limit 1`); 
    if(financialyear.rows.length > 0)
    {
      var check_count  = financialyear && financialyear.rows[0].financial_year_id
      response = {"financial_year_id":check_count,"status":true}
    }
    else{
      response = {"message":constants.userMessage.FINANCIAL_MISSING,"status":false}
    }
    return response;
  } catch (error) {
    if(client){
      client.end(); 
    }   
    throw new Error(error);
  }
}
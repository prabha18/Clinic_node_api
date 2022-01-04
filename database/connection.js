/****************************
 Developed by : Shiva Software Solutions
 File    : connection.js 
 Date    : 19-11-2021
 Purpose : Database connection
 * ********************** */
 //UAT Database Connection

const connectionString ={
    user: 'postgres',
    host: '172.16.1.200',
    database: 'db_hospital_management_dev',
    password: 'postgres',
    port: 5432,
  }
// const connectionString ={
//     user: 'postgres',
//     host: '127.0.0.1',
//     database: 'db_hospital_management_dev',
//     password: 'shiva$123',
//     port: 5433,
//   }
module.exports = connectionString;


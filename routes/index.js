var express = require('express');
const bodyParser = require('body-parser')
module.exports = app => {
  app.use('/api/common', require('../api/common'));
  app.use('/api/master', require('../api/master'));
  app.use('/api/patient', require('../api/patient'));
  app.use('/api/appointment', require('../api/appointment'));
  app.use('/api/consultation', require('../api/consultation'));
  app.use('/api/login', require('../api/login'));
  app.use('/api/setting', require('../api/setting'));
  app.use('/api/lab', require('../api/lab'));
  app.use('/api/cashModule', require('../api/cashmodule'));
  app.use('/api/radiology',require('../api/radiology'))
  app.use(express.static('images/clinical_photography'));
}
const app = express();
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true,
      limit: '500mb',
    parameterLimit: 10000000 }))

// parse application/json
app.use(bodyParser.json({
      limit: '500mb',
      parameterLimit: 10000000
      }));
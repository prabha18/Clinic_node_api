'use strict';
var express = require('express');
var setting = require('./setting.controller');
var financial = require('./financial.controller');
const financialMgmtSchema = require('../../apiSchema/financialMgmtSchema');
const settingMgmtSchema = require('../../apiSchema/settingMgmtSchema');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
var router = express.Router();

//Create setting jwt 
router.post('/createSettingJwt',
joiSchemaValidation.validateBody(settingMgmtSchema.createSettingJwt),
setting.createSettingJwt
);

//Create setting
router.post('/createSetting',
joiSchemaValidation.validateBody(settingMgmtSchema.createSetting),
setting.createSetting
);

//Editload setting jwt 
router.post('/editloadSettingJwt',
joiSchemaValidation.validateBody(settingMgmtSchema.editloadSettingJwt),
setting.editloadSettingJwt
);

//Editload setting
router.post('/editloadSetting',
joiSchemaValidation.validateBody(settingMgmtSchema.editloadSetting),
setting.editloadSetting
);

//Create financial jwt 
router.post('/createFinancialJwt',
joiSchemaValidation.validateBody(financialMgmtSchema.createFinancialJwt),
financial.createFinancialJwt
);

//Create financial
router.post('/createFinancial',
joiSchemaValidation.validateBody(financialMgmtSchema.createFinancial),
financial.createFinancial
);

//Editload financial jwt 
router.post('/editloadFinancialJwt',
joiSchemaValidation.validateBody(financialMgmtSchema.editloadFinancialJwt),
financial.editloadFinancialJwt
);

//Editload financial
router.post('/editloadFinancial',
joiSchemaValidation.validateBody(financialMgmtSchema.editloadFinancial),
financial.editloadFinancial
);

//list financial jwt 
router.post('/listFinancialJwt',
joiSchemaValidation.validateBody(financialMgmtSchema.listFinancialJwt),
financial.listFinancialJwt
);

//list financial
router.post('/listFinancial',
joiSchemaValidation.validateBody(financialMgmtSchema.listFinancial),
financial.listFinancial
);
module.exports = router;
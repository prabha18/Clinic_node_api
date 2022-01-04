'use strict';

var express = require('express');
var radiology = require('./radiologyPrice.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const radiologyPriceSchema = require('../../apiSchema/radiologyPriceMgmtSchema');

var router = express.Router();

//Create radiology price jwt 
router.post('/createRadiologyPriceJwt',
joiSchemaValidation.validateBody(radiologyPriceSchema.createRadiologyPriceJwt),
radiology.createRadiologyPriceJwt
);

//Create radiology price
router.post('/createRadiologyPrice', 
 joiSchemaValidation.validateBody(radiologyPriceSchema.createRadiologyPrice),
 radiology.createRadiologyPrice
);

//Edit radiology price jwt 
router.post('/editloadRadiologyPriceJwt',
joiSchemaValidation.validateBody(radiologyPriceSchema.editloadRadiologyPriceJwt),
radiology.editloadRadiologyPriceJwt
);

//Edit radiology price
router.post('/editloadRadiologyPrice', 
 joiSchemaValidation.validateBody(radiologyPriceSchema.editloadRadiologyPrice),
 radiology.editloadRadiologyPrice
);

//List radiology price jwt 
router.post('/listRadiologyPriceJwt',
joiSchemaValidation.validateBody(radiologyPriceSchema.listRadiologyPriceJwt),
radiology.listRadiologyPriceJwt
);

//List radiology price
router.post('/listRadiologyPrice', 
 joiSchemaValidation.validateBody(radiologyPriceSchema.listRadiologyPrice),
 radiology.listRadiologyPrice
);

module.exports = router;
'use strict';

var express = require('express');
var consultation = require('./consultation.controller');
const consultationMgmtSchema = require('../../apiSchema/consultationMgmtSchema');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
var router = express.Router();

//Create Consultation jwt 
router.post('/createConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.createConsultationJwt),
consultation.createConsultationJwt
);

//Create Consultation
router.post('/createConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.createConsultation),
consultation.createConsultation
);

//Get Consultation Jwt
router.post('/getDataConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getDataConsultationJwt),
consultation.getDataConsultationJwt
);

//Get Consultation
router.post('/getDataConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.getDataConsultation),
consultation.getDataConsultation
);

 //List Consultation Jwt
router.post('/listConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.listConsultationJwt),
consultation.listConsultationJwt
);

//List Consultation
router.post('/listConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.listConsultation),
consultation.listConsultation
);

//Edit Consultation Jwt
router.post('/editloadConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.editloadConsultationJwt),
consultation.editloadConsultationJwt
);

//Edit Consultation
router.post('/editloadConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.editloadConsultation),
consultation.editloadConsultation
);

//Clinic History Jwt
router.post('/clinicHistoryJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.clinicHistoryJwt),
consultation.clinicHistoryJwt
);

//Clinic History
router.post('/clinicHistory',
joiSchemaValidation.validateBody(consultationMgmtSchema.clinicHistory),
consultation.clinicHistory
);

//Previous Consultation JWt
router.post('/previousConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.previousConsultationJwt),
consultation.previousConsultationJwt
);

//Previous Consultation
router.post('/previousConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.previousConsultation),
consultation.previousConsultation
);

//Next Consultation Jwt
router.post('/nextConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.nextConsultationJwt),
consultation.nextConsultationJwt
);

//Next Consultation 
router.post('/nextConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.nextConsultation),
consultation.nextConsultation
);

//Update payement Jwt
router.post('/updatePaymentStatusJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.updatePaymentStatusJwt),
consultation.updatePaymentStatusJwt
);

///Update payement  
router.post('/updatePaymentStatus',
joiSchemaValidation.validateBody(consultationMgmtSchema.updatePaymentStatus),
consultation.updatePaymentStatus
);

// //clinical Photography Jwt
// router.post('/clinicalPhotographyJwt',
// joiSchemaValidation.validateBody(consultationMgmtSchema.clinicalPhotographyJwt),
// consultation.clinicalPhotographyJwt
// );

///clinical Photography  
router.post('/clinicalPhotography',
joiSchemaValidation.validateBody(consultationMgmtSchema.clinicalPhotography),
consultation.clinicalPhotography
);


//clinical Consultation Images Jwt
router.post('/getConsultationclinicalImagesJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getConsultationclinicalImagesJwt),
consultation.getConsultationclinicalImagesJwt
);

///clinical Consultation Images
router.post('/getConsultationclinicalImages',
joiSchemaValidation.validateBody(consultationMgmtSchema.getConsultationclinicalImages),
consultation.getConsultationclinicalImages
);

//clinical Patient Images Jwt
router.post('/getPatientclinicalImagesJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getPatientclinicalImagesJwt),
consultation.getPatientclinicalImagesJwt
);

///clinical Patient Images
router.post('/getPatientclinicalImages',
joiSchemaValidation.validateBody(consultationMgmtSchema.getPatientclinicalImages),
consultation.getPatientclinicalImages
);
module.exports = router;
const constants = require('../../constants');
const ConsultationMgmtService = require('../../service/ConsultationMgmtService');

//Create Consultation JWt Module
module.exports.createConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.createConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Create Consultation Module
module.exports.createConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.createConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get Data Consultation Jwt Module
module.exports.getDataConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getDataConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get Data Consultation Module
module.exports.getDataConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getDataConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
// List Consultation Jwt Module
module.exports.listConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.listConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//List Consultation  Module
module.exports.listConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.listConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Edit  Consultation Jwt  Module
module.exports.editloadConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.editloadConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Edit Consultation  Module
module.exports.editloadConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.editloadConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Clinic History Jwt Jwt  Module
module.exports.clinicHistoryJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.clinicHistoryJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Clinic History   Module
module.exports.clinicHistory = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.clinicHistory(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Previous Consultation Jwt Module
module.exports.previousConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.previousConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Previous Consultation Module
module.exports.previousConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.previousConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Next Consultation  Jwt Module
module.exports.nextConsultationJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.nextConsultationJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Next Consultation  Module
module.exports.nextConsultation = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.nextConsultation(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Update payement Jwt Module
module.exports.updatePaymentStatusJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.updatePaymentStatusJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Update payement Module
module.exports.updatePaymentStatus = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.updatePaymentStatus(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// //clinical Photography Jwt Module
// module.exports.clinicalPhotographyJwt = async (req, res) => {
//     let response = {};
//     try {
//         const responseFromService = await ConsultationMgmtService.clinicalPhotographyJwt(req.body);
//         if (!responseFromService.token) {
//             response.status = 200;
//         }
//         response.body = responseFromService;
//     } catch (error) {
//         response.message = error.message;
//     }
//     return res.send(response);
// }
//clinical Photography Module
module.exports.clinicalPhotography = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.clinicalPhotography(req.body);
        console.log(responseFromService,"comtroller")
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Consultation clinicalImages Jwt  Module
module.exports.getConsultationclinicalImagesJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getConsultationclinicalImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Consultation clinicalImages Module
module.exports.getConsultationclinicalImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getConsultationclinicalImages(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Patient clinicalImages Jwt  Module
module.exports.getPatientclinicalImagesJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getPatientclinicalImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Patient clinicalImages Module
module.exports.getPatientclinicalImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ConsultationMgmtService.getPatientclinicalImages(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

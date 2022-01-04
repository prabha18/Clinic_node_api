const constants = require('../../constants');
const AppointmentMgmtService = require('../../service/AppointmentMgmtService');

//Create Appointment JWt Module
module.exports.createAppointmentJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.createAppointmentJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Create Appointment Module
module.exports.createAppointment = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.createAppointment(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Delete Appointment Jwt Module
module.exports.deleteAppointmentJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.deleteAppointmentJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Delete Appointment Module
module.exports.deleteAppointment = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.deleteAppointment(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
// List Appointment Jwt Module
module.exports.listAppointmentJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.listAppointmentJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//List Appointment  Module
module.exports.listAppointment = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.listAppointment(req.body);
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
//Edit  Appointment Jwt  Module
module.exports.editloadAppointmentJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.editloadAppointmentJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Edit Appointment  Module
module.exports.editloadAppointment = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.editloadAppointment(req.body);
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
//Search  Appointment Jwt  Module
module.exports.searchPatientsJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.searchPatientsJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Search Appointment  Module
module.exports.searchPatients = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.searchPatients(req.body);
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
//Create Session JWt Module
module.exports.createSessionJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.createSessionJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Create Session Module
module.exports.createSession = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.createSession(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Get Session JWt Module
module.exports.getSessionidJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.getSessionidJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get Session Module
module.exports.getSessionid = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.getSessionid(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get skip Jwt Module
module.exports.skipResumePatientJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.skipResumePatientJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get skip Module
module.exports.skipResumePatient = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.skipResumePatient(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Get Token Jwt
module.exports.getTokenJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.getTokenJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get Token
module.exports.getToken = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.getToken(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get Sessions JWt Module
module.exports.getSessionsJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.getSessionsJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Get Sessions Module
module.exports.getSessions = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppointmentMgmtService.getSessions(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
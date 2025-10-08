const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/serviceRequestController');
const serviceRequestValidator = require('../validators/serviceRequestValidator');

router.get('/', serviceRequestController.getAllServiceRequests);
router.get('/:id', serviceRequestController.getServiceRequestById);
router.post('/', serviceRequestValidator.createServiceRequest, serviceRequestController.createServiceRequest);
router.put('/:id', serviceRequestValidator.updateServiceRequest, serviceRequestController.updateServiceRequest);
router.delete('/:id', serviceRequestController.deleteServiceRequest);

module.exports = router;

const express = require('express');
const router = express.Router();
const {validateRequestSchema} = require("../middlewares/Common/ValidateRequest");
const {
    validateHeaderSchema,
    validatePincodeSchema
} = require('../libraries/AppotaPay/ValidationSchemas/PincodeRequestSchema');
const PincodeController = require('../controllers/PincodeController');

/**
 * Endpoint: POST /v1/Pincode/charging
 */
router.post('/purchase',
    /**
     * Step 1: validate headers and request body
     */
    validateRequestSchema('headers', validateHeaderSchema),
    validateRequestSchema('body', validatePincodeSchema),
    PincodeController.buycard
);

/**
 * Endpoint: GET /v1/Pincode/transactions
 */
router.get('/transactions/:partner_ref_id', PincodeController.transactions);

module.exports = router;


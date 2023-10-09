const Joi = require("joi");

const validateHeaderSchema = Joi.object({
    'x-service-id': Joi.string().trim().required().messages({
        'string.base': 'x-service-id phải là chuỗi',
        'string.empty': 'x-service-id không được bỏ trống',
        'any.required': 'x-service-id không được bỏ trống',
    }),
    'x-tenant-id': Joi.string().trim().optional().default(APP_SETTINGS.DEFAULT_TENANT_ID).messages({
        'string.base': 'x-tenant-id phải là chuỗi',
        'string.empty': 'x-tenant-id không được bỏ trống',
    }),
}).options({
    allowUnknown: true,
    stripUnknown: false,
});

const validatePincodeSchema = Joi.object({
    partner_ref_id: Joi.string().trim().optional().messages({
        'string.base': 'Mã giao dịch phải là chuỗi',
    }),
    
    productCode: Joi.string().trim().required().messages({
        'string.base': 'Mã sản phẩm phải là chuỗi',
        'string.empty': 'Mã sản phẩmkhông được bỏ trống',
        'any.required': 'Mã sản phẩm không được bỏ trống',
    }),

    quantity: Joi.number().min(0).integer().required().messages({
        'number.base': 'Số lượng thẻ mua phải là số nguyên.',
        'number.less': 'Số lượng thẻ mua không nhỏ hơn 0.',
        'any.required': 'Số lượng thẻ mua không được bỏ trống'
    }),
}).options({
    allowUnknown: true,
    stripUnknown: true,
});

module.exports = {
    validateHeaderSchema,
    validatePincodeSchema
};

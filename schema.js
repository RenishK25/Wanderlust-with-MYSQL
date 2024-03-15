const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    list : Joi.object({
        // username : Joi.string().alphanum().min(3).max(30).required(),
        title : Joi.string().required(),
        description : Joi.string().required(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        country : Joi.string().allow("", null),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.string().required(),
        comment : Joi.string().required(),
    }).required()
});
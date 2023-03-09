const Joi = require('joi')
module.exports.campvalidation=Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(10),
        location:Joi.string().required(),
        image:Joi.string().required(),
        discreption:Joi.string().required()
    }).required()
    
})
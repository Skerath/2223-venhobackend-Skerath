const Joi = require('joi');

const JOI_OPTIONS = {
    abortEarly: false, // include all error
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
    context: true,
}

const validateQuery = (schema) => {
    if (!schema)
        schema = {
            query: {},
            body: {},
            params: {},
        };

    return (ctx, next) => {
        const errors = {}
        if (!Joi.isSchema(schema.params))
            schema.params = Joi.object(schema.params || {});


        const {
            error: paramsError,
            value: paramsValue,
        } = schema.params.validate(
            Object.keys(ctx.request.query).length === 0 ? ctx.params : ctx.request.query,
            JOI_OPTIONS);

        if (paramsError)
            errors.params = cleanupJoiError(paramsError);
        else
            ctx.params = paramsValue;

        if (Object.keys(errors).length)
            ctx.throw(400, 'Validation failed, check details for more information', {
                code: 'VALIDATION_FAILED',
                details: errors,
            });

        return next();
    };
}


const cleanupJoiError = (error) => error.details.reduce((resultObj, {
    message,
    path,
    type,
}) => {
    const joinedPath = path.join('.') || 'value';

    if (!resultObj[joinedPath])
        resultObj[joinedPath] = [];

    resultObj[joinedPath].push({
        type,
        message,
    });

    return resultObj;
}, {});


module.exports = {
    validateQuery,
};
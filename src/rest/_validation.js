const Joi = require('joi');

const JOI_OPTIONS = {
    abortEarly: false, // include all error
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
    context: true,
}

const validate = (schema, Joi_Options) => {

    if (!schema)
        schema = {
            query: {},
            body: {},
            params: {},
        };

    if (!Joi_Options) {
        Joi_Options = JOI_OPTIONS;
    }

    return (ctx, next) => {
        const errors = {}
        if (schema.query) {
            if (!Joi.isSchema(schema.query))
                schema.query = Joi.object(schema.query);

            const {
                error: queryErrors,
                value: queryValue,
            } = schema.query.validate(
                ctx.query,
                Joi_Options);

            if (queryErrors)
                errors.query = cleanupJoiError(queryErrors);
            else
                ctx.query = queryValue;
        }


        if (schema.body) {
            if (!Joi.isSchema(schema.body)) {
                schema.body = Joi.object(schema.body);
            }

            const {
                error: bodyErrors,
                value: bodyValue,
            } = schema.body.validate(
                ctx.request.body,
                Joi_Options,
            );

            if (bodyErrors) {
                errors.body = cleanupJoiError(bodyErrors);
            } else {
                ctx.request.body = bodyValue;
            }
        }

        if (schema.params) {
            if (!Joi.isSchema(schema.params)) {
                schema.params = Joi.object(schema.params);
            }

            const {
                error: paramsErrors,
                value: paramsValue,
            } = schema.params.validate(
                ctx.params,
                Joi_Options,
            );

            if (paramsErrors) {
                errors.params = cleanupJoiError(paramsErrors);
            } else {
                ctx.params = paramsValue;
            }
        }


        if (Object.keys(errors).length) {
            ctx.throw(400, 'Validation failed, check details for more information', {
                code: 'VALIDATION_FAILED',
                details: errors,
            });
        }

        return next();
    };
};

const validateAsync = async (schema) => {

    if (!schema)
        schema = {
            query: {},
            body: {},
            params: {},
        };

    return async (ctx, next) => {
        const errors = {}
        if (schema.query) {
            if (!Joi.isSchema(schema.query))
                schema.query = Joi.object(schema.query);

            const {
                error: queryErrors,
                ...queryValue
            } = await schema.query.validateAsync(
                ctx.request.query,
                JOI_OPTIONS);

            if (queryErrors)
                errors.query = cleanupJoiError(queryErrors);
            else
                ctx.request.query = queryValue;
        }


        if (schema.body) {
            if (!Joi.isSchema(schema.body)) {
                schema.body = Joi.object(schema.body);
            }

            const {
                error: bodyErrors,
                value: bodyValue,
            } = await schema.body.validateAsync(
                ctx.request.body,
                JOI_OPTIONS,
            );

            if (bodyErrors) {
                errors.body = cleanupJoiError(bodyErrors);
            } else {
                ctx.request.body = bodyValue;
            }
        }

        if (schema.params) {
            if (!Joi.isSchema(schema.params)) {
                schema.params = Joi.object(schema.params);
            }

            const {
                error: paramsErrors,
                value: paramsValue,
            } = await schema.params.validateAsync(
                ctx.params,
                JOI_OPTIONS,
            );

            if (paramsErrors) {
                errors.params = cleanupJoiError(paramsErrors);
            } else {
                ctx.params = paramsValue;
            }
        }


        if (Object.keys(errors).length) {
            ctx.throw(400, 'Validation failed, check details for more information', {
                code: 'VALIDATION_FAILED',
                details: errors,
            });
        }

        return next();
    };
};


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
    validate,
    validateAsync
};
import joi from 'joi';

export const email = joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
    .required();
export const password = joi.string().min(6).required();
export const bid = joi.string().required();
export const title = joi.string().required();
export const price = joi.number().required();
export const available = joi.number().required();
export const category_code = joi.string().uppercase().alphanum().required();
export const image = joi.string().required();
export const bids = joi.array().required();
export const filenames = joi.array().required();
export const description = joi.string();

import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_error';
import { email, password } from '../helpers/joi_schema';
import joi from 'joi';

export const register = async (req, res) => {
    try {
        const { error } = joi.object({ email, password }).validate(req.body);
        if (error) return badRequest(error.details[0]?.message, res);
        const response = await services.register(
            req.body.email,
            req.body.password,
        );
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({
                err: 1,
                mes: 'Missing payloads',
            });
        const response = await services.login(email, password);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const refreshToken = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({
                err: 1,
                mes: 'Missing payloads',
            });
        const response = await services.login(email, password);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

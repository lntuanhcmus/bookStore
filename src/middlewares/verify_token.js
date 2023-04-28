import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { notAuth } from '../middlewares/handle_error';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return notAuth('Require authorization', res);
    const accessToken = token.split(' ')[1];
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        const isExpired = err instanceof TokenExpiredError;
        if (!isExpired)
            return notAuth('Access Token was invalid', res, isExpired);
        if (isExpired)
            return notAuth('AccessToken was expired', res, isExpired);
        req.user = user;
        next();
    });
};

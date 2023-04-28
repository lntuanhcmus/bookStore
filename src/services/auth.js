import db from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const hashPassword = (passwood) =>
    bcrypt.hashSync(passwood, bcrypt.genSaltSync(10));

export const register = (email, password) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOrCreate({
                where: { email },
                defaults: {
                    email,
                    password: hashPassword(password),
                },
                raw: true,
            });
            const accessToken = response[1]
                ? jwt.sign(
                      {
                          id: response[0].id,
                          email: response[0].email,
                          role_code: response[0].role_code,
                      },
                      process.env.JWT_SECRET,
                      { expiresIn: '5s' },
                  )
                : null;

            const refreshToken = response[1]
                ? jwt.sign(
                      {
                          id: response[0].id,
                      },
                      process.env.JWT_SECRET_REFRESH_TOKEN,
                      { expiresIn: '30d' },
                  )
                : null;
            resolve({
                err: response[1] ? 0 : 1,
                mes: response[1] ? 'Register is successfully' : 'Email is used',
                access_token: accessToken
                    ? `Bearer ${accessToken}`
                    : accessToken,
                refresh_token: refreshToken,
            });
            if (refreshToken) {
                await db.User.update(
                    {
                        refresh_token: refreshToken,
                    },
                    {
                        where: { id: response[0].id },
                    },
                );
            }
        } catch (error) {
            reject(error);
        }
    });

export const login = (email, password) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: { email },
                raw: true,
            });

            const isChecked =
                response && bcrypt.compareSync(password, response.password);

            const token = isChecked
                ? jwt.sign(
                      {
                          id: response.id,
                          email: response.email,
                          role_code: response.role_code,
                      },
                      process.env.JWT_SECRET,
                      { expiresIn: '5s' },
                  )
                : null;

            const refreshToken = isChecked
                ? jwt.sign(
                      {
                          id: response.id,
                      },
                      process.env.JWT_SECRET_REFRESH_TOKEN,
                      { expiresIn: '15d' },
                  )
                : null;

            resolve({
                err: response ? 0 : 1,
                mes: token
                    ? 'Login is successfully'
                    : response
                    ? 'Password was incorrect'
                    : 'Email is incorrect',
                access_token: token ? `Bearer ${token}` : token,
                refresh_token: refreshToken,
            });
            if (refreshToken) {
                await db.User.update(
                    {
                        refresh_token: refreshToken,
                    },
                    {
                        where: { id: response.id },
                    },
                );
            }
        } catch (error) {
            reject(error);
        }
    });

export const refreshToken = (refresh_token) =>
    new Promise(async (resolve, reject) => {
        try {
        } catch (error) {
            reject(error);
        }
    });

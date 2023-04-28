import db from '../models';
import { Op } from 'sequelize';
import { v4 as generateId } from 'uuid';
const cloudinary = require('cloudinary').v2;

export const getBooks = ({ page, limit, order, name, available, ...query }) =>
    new Promise(async (resolve, reject) => {
        try {
            const queries = { raw: true, nest: true };
            const offset = !page || +page <= 1 ? 0 : +page - 1;
            const fLimit = +limit || +process.env.LIMIT_BOOK;
            queries.offset = offset * fLimit;
            queries.limit = fLimit;
            if (order) queries.order = [order];
            else queries.order = [['id', 'DESC']];
            if (name) query.title = { [Op.substring]: name };
            const response = await db.Book.findAndCountAll({
                where: query,
                ...queries,
                attributes: {
                    exclude: ['category_code'],
                },
                include: [
                    {
                        model: db.Category,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        as: 'categoryData',
                    },
                ],
            });

            resolve({
                err: response ? 0 : 1,
                mes: response ? 'Got' : 'Could not find',
                bookData: response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const createNewBook = (body, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Book.findOrCreate({
                where: { title: body.title },
                defaults: {
                    ...body,
                    id: generateId(),
                    image: fileData?.path,
                    filename: fileData?.filename,
                },
            });
            resolve({
                err: response[1] ? 0 : 1,
                mes: response[1] ? 'Created' : 'Could create new book',
            });
            if (fileData && !response[1]) cloudinary.destroy(fileData.filename);
        } catch (error) {
            reject(error);
            if (fileData) cloudinary.destroy(fileData.filename);
        }
    });

// UPDATE
export const updateBook = ({ bid, ...body }, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            if (fileData) body.image = fileData?.path;
            const response = await db.Book.update(body, {
                where: { id: bid },
            });
            resolve({
                err: response[0] > 0 ? 0 : 1,
                mes:
                    response[0] > 0
                        ? `${response[0]} book updated`
                        : 'Couldnot update book/ Book ID not found',
            });
            if (fileData && !response[1]) cloudinary.destroy(fileData.filename);
        } catch (error) {
            reject(error);
            if (fileData) cloudinary.destroy(fileData.filename);
        }
    });

// DELETE
export const deleteBook = ({ bids, filenames }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Book.destroy({
                where: { id: bids },
            });
            resolve({
                err: response > 0 ? 0 : 1,
                mes:
                    response > 0
                        ? `${response} book(s) deleted`
                        : 'Couldnot delete book/ Book ID not found',
            });
            cloudinary.api.delete_resources(filenames);
        } catch (error) {
            reject(error);
        }
    });

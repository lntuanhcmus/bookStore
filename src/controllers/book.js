import * as services from '../services';
import { internalServerError, badRequest } from '../middlewares/handle_error';
import joi from 'joi';
import {
    bid,
    title,
    image,
    category_code,
    price,
    available,
    bids,
    filenames,
    description,
} from '../helpers/joi_schema';
const cloudinary = require('cloudinary').v2;

export const getBooks = async (req, res) => {
    try {
        const response = await services.getBooks(req.query);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const createNewBook = async (req, res) => {
    try {
        const fileData = req.file;
        const { error } = joi
            .object({
                title,
                image,
                category_code,
                price,
                available,
                description,
            })
            .validate({
                ...req.body,
                image: fileData?.path,
            });
        if (error) {
            // uploader.resources to remove multiple images
            // uploader.destroy to remove single image
            if (fileData) cloudinary.uploader.destroy(fileData.filename);
            return badRequest(error.details[0].message, res);
        }
        const response = await services.createNewBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {}
};

//UPDATE Book
export const updateBook = async (req, res) => {
    try {
        const fileData = req.file;
        const { error } = joi.object({ bid }).validate({ bid: req.body.bid });
        if (error) {
            // uploader.resources to remove multiple images
            // uploader.destroy to remove single image
            if (fileData) cloudinary.uploader.destroy(fileData.filename);
            return badRequest(error.details[0].message, res);
        }
        const response = await services.updateBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {}
};

//DELETE Book
export const deleteBook = async (req, res) => {
    try {
        const { error } = joi.object({ bids, filenames }).validate(req.query);
        if (error) {
            // uploader.resources to remove multiple images
            // uploader.destroy to remove single image
            return badRequest(error.details[0].message, res);
        }
        const response = await services.deleteBook(req.query);
        return res.status(200).json(response);
    } catch (error) {}
};

import User from '../model/user.schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Controller for user-related functions

// Function for registering a new user
export const register = async (req, res) => {
    const { firstName, lastName, email, password: plainPassword, mobile, gender } = req.body;
    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).send({
                message: 'User already exists, please try again.',
                statusCode: 400
            });
        }

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(plainPassword, salt);

        user = new User({
            firstName, lastName, email, password, mobile, gender
        });

        await user.save();

        return res.status(201).send({
            message: 'User registered successfully, please login.',
            statusCode: 201
        });

    } catch (e) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            statusCode: 400
        });
    }
};

// Function for user login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({
                message: 'Invalid email, please try again.',
                statusCode: 401
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({
                message: 'Invalid password, please try again.',
                statusCode: 401
            });
        }

        const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);

        user.token = token;
        await user.save();

        const { password: _, __v: __, ...userData } = user._doc;

        return res.status(200).send({
            message: 'Login successful.',
            statusCode: 200,
            data: userData
        });

    } catch (e) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            statusCode: 400
        });
    }
};

// Function for getting profile details
export const profileDetails = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return res.status(400).send({
                message: 'Invalid token, please authenticate.',
                statusCode: 400
            });
        }

        const { password: _, __v: __, ...userData } = user._doc;

        return res.status(200).send({
            message: 'OK',
            statusCode: 200,
            data: userData
        });

    } catch (e) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            statusCode: 400
        });
    }
};

// Function for logging out the user
export const logout = async (req, res) => {
    try {
        req.user.token = '';
        await req.user.save();

        return res.status(200).send({
            message: 'Logout successful.',
            statusCode: 200
        });

    } catch (e) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            statusCode: 400
        });
    }
};

// Function for getting all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password -__v -token');

        return res.status(200).send({
            message: 'Users retrieved successfully.',
            statusCode: 200,
            data: users
        });
    } catch (e) {
        return res.status(400).send({
            message: 'Something went wrong, please try again.',
            statusCode: 400
        });
    }
};

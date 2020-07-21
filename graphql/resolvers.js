const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Place = require('../models/place');
const { clearImage } = require('../util/file');

module.exports = {
    createUser: async function ({ userInput }, req) {
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'E-Mail is invalid.' });
        }
        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: 'Password too short!' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const existingUser = await User.findOne({ email: userInput.email });
        if (existingUser) {
            const error = new Error('User exists already!');
            throw error;
        }
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw,
        });
        const createdUser = await user.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
    login: async function ({ email, password }) {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('User not found.');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Password is incorrect.');
            error.code = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
            },
            process.env.TOKEN,
            { expiresIn: process.env.TOKEN_DURATION }
        );
        return { token: token, userId: user._id.toString() };
    },
    createPlace: async function ({ placeInput }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const errors = [];
        if (validator.isEmpty(placeInput.title) || !validator.isLength(placeInput.title, { min: 5 })) {
            errors.push({ message: 'Title is invalid.' });
        }
        if (validator.isEmpty(placeInput.description) || !validator.isLength(placeInput.description, { min: 5 })) {
            errors.push({ message: 'Description is invalid.' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('Invalid user.');
            error.code = 401;
            throw error;
        }
        const place = new Place({
            title: placeInput.title,
            description: placeInput.description,
            imageUrl: placeInput.imageUrl.replace('\\', '/'),
            creator: user,
        });
        const createdPlace = await place.save();
        user.places.push(createdPlace);
        await user.save();
        return {
            ...createdPlace._doc,
            _id: createdPlace._id.toString(),
            createdAt: createdPlace.createdAt.toISOString(),
            updatedAt: createdPlace.updatedAt.toISOString(),
        };
    },
    places: async function ({ page }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        if (!page) {
            page = 1;
        }
        const perPage = 2;
        const totalPlaces = await Place.find().countDocuments();
        const places = await Place.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('creator');
        return {
            places: places.map((p) => {
                return {
                    ...p._doc,
                    _id: p._id.toString(),
                    createdAt: p.createdAt.toISOString(),
                    updatedAt: p.updatedAt.toISOString(),
                };
            }),
            totalPlaces: totalPlaces,
        };
    },
    place: async function ({ id }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const place = await Place.findById(id).populate('creator');
        if (!place) {
            const error = new Error('No place found!');
            error.code = 404;
            throw error;
        }
        return {
            ...place._doc,
            _id: place._id.toString(),
            createdAt: place.createdAt.toISOString(),
            updatedAt: place.updatedAt.toISOString(),
        };
    },
    updatePlace: async function ({ id, placeInput }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const place = await Place.findById(id).populate('creator');
        if (!place) {
            const error = new Error('No place found!');
            error.code = 404;
            throw error;
        }
        if (place.creator._id.toString() !== req.userId.toString()) {
            const error = new Error('Not authorized!');
            error.code = 403;
            throw error;
        }
        const errors = [];
        if (validator.isEmpty(placeInput.title) || !validator.isLength(placeInput.title, { min: 5 })) {
            errors.push({ message: 'Title is invalid.' });
        }
        if (validator.isEmpty(placeInput.description) || !validator.isLength(placeInput.description, { min: 5 })) {
            errors.push({ message: 'Description is invalid.' });
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }
        place.title = placeInput.title;
        place.content = placeInput.content;
        if (placeInput.imageUrl !== 'undefined') {
            place.imageUrl = placeInput.imageUrl.replace('\\', '/');
        }
        const updatedPlace = await place.save();
        return {
            ...updatedPlace._doc,
            _id: updatedPlace._id.toString(),
            createdAt: updatedPlace.createdAt.toISOString(),
            updatedAt: updatedPlace.updatedAt.toISOString(),
        };
    },
    deletePlace: async function ({ id }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const place = await Place.findById(id);
        if (!place) {
            const error = new Error('No place found!');
            error.code = 404;
            throw error;
        }
        if (place.creator.toString() !== req.userId.toString()) {
            const error = new Error('Not authorized!');
            error.code = 403;
            throw error;
        }
        clearImage(place.imageUrl);
        await Place.findByIdAndRemove(id);
        const user = await User.findById(req.userId);
        user.places.pull(id);
        await user.save();
        return true;
    },
    user: async function (args, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!');
            error.code = 401;
            throw error;
        }
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('No user found!');
            error.code = 404;
            throw error;
        }
        return { ...user._doc, _id: user._id.toString() };
    },
};

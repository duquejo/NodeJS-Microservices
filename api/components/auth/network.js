const express = require('express');

const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();
router.use( express.json() );

/**
 * Login
 */
const login = async ( req, res, next) => {
    try {
        const { body } = req;
        const token = await Controller.login( body.username, body.password );
        response.success( req, res, token, 200 );
    } catch (error) {
        next(error);
    }
};

/**
 * Routes
 */
router.post('/login', login );

module.exports = router;
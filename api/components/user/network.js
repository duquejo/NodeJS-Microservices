const express = require('express');

const secure = require('./secure');
const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();
router.use( express.json() );


/**
 * Actions
 */
 const list = async ( req, res, next ) => {
    try {
        const list = await Controller.list();
        response.success( req, res, list, 200 );
    } catch (error) {
        next(error);
    }
};

/**
 * Get users action
 * @param {*} req 
 * @param {*} res 
 */
const get = async ( req, res, next ) => {
    try {
        const user = await Controller.get( req.params );
        response.success( req, res, user, 200 );
    } catch (error) {
        next(error);
    }
};

/**
 * Add user action
 * @param {*} req 
 * @param {*} res 
 */
const upsert = async ( req, res, next ) => {
    try {
        const newUser = await Controller.upsert( req.body );
        response.success( req, res, newUser, 200 );
    } catch (error) {    
        next( error );
    }
};

/**
 * Remove user action
 * @param {*} req 
 * @param {*} res 
 */
const remove = async ( req, res, next ) => {
    try {
        const deletedUser = await Controller.remove( req.params.id );
        response.success( req, res, deletedUser, 200 );
    } catch (error) {
        next(error);
    }
};

/**
 * Update user data action
 * @param {*} req 
 * @param {*} res 
 */
const update = async ( req, res, next ) => {
    try {
        const updatedUser = await Controller.update( req.params.id, req.body );
        response.success( req, res, updatedUser, 200 );
    } catch (error) {
        next(error);
    }
};

/**
 * Add new follower
 * @param {*} req 
 * @param {*} res 
 */
const follow = async ( req, res, next ) => {
    try {
        const follow = await Controller.follow( req.user.id, req.params.id );
        response.success( req, res, follow, 200 );
    } catch (error) {
        next(error);
    }
};

/**
 * List followers
 * @param {*} req 
 * @param {*} res 
 */
const followers = async ( req, res, next ) => {
    try {
        const followers = await Controller.followers( req.params.id );
        response.success( req, res, followers, 200 );
    } catch (error) {
        next(error);
    }
};


/**
 * Routes
 */
router.get('/', list );
router.get('/:id', get );
router.post('/', upsert );
router.delete('/:id', remove );
router.put('/:id', secure( 'update' ), update );

router.post('/follow/:id', secure( 'follow' ), follow );
router.get('/:id/followers', followers );

module.exports = router;
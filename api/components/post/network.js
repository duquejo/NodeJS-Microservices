const express = require('express');

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
 * Get post by id action
 * @param {*} req 
 * @param {*} res 
 */
 const get = async ( req, res, next ) => {
    try {
        const post = await Controller.get( req.params );
        response.success( req, res, post, 200 );
    } catch (error) {
        next(error);
    }
};

/**
 * Add post action
 * @param {*} req 
 * @param {*} res 
 */
 const upsert = async ( req, res, next ) => {
    try {
        const newPost = await Controller.upsert( req.body );
        response.success( req, res, newPost, 200 );
    } catch (error) {    
        next( error );
    }
};

/**
 * Remove post remove action
 * @param {*} req 
 * @param {*} res 
 */
const remove = async ( req, res, next ) => {
    try {
        const deletedPost = await Controller.remove( req.params.id );
        response.success( req, res, deletedPost, 200 );
    } catch (error) {
        next(error);
    }
};

/**
 * Update post data action
 * @param {*} req 
 * @param {*} res 
 */
 const update = async ( req, res, next ) => {
    try {
        const updatedPost = await Controller.update( req.params.id, req.body );
        response.success( req, res, updatedPost, 200 );
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
router.put( '/:id', update );

module.exports = router;
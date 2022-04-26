const express = require('express');

const response = require('../network/response');
const Store = require('../store/mysql');

const router = express.Router();
router.use( express.json() );

const list = async ( req, res, next ) => {
    try {
        const data = await Store.list( req.params.table );
        response.success( req, res, data, 200 );
    } catch (error) {
        next(error);
    }
};

const get = async ( req, res, next ) => {
    try {
        const data = await Store.get( req.params.table, { id: req.params.id } );
        response.success( req, res, data, 200 );
    } catch (error) {
        next(error);
    }
};

const upsert = async ( req, res, next ) => {
    try {
        const data = await Store.upsert( req.params.table, req.body );
        response.success( req, res, data, 200 );
    } catch (error) {
        next(error);
    }
};

const update = async ( req, res, next ) => {
    try {
        const data = await Store.update( req.params.table, { id: req.params.id, data: req.body } );
        response.success( req, res, data, 200 );
    } catch (error) {
        next(error);
    }
};

const remove = async ( req, res, next ) => {
    try {
        const data = await Store.remove( req.params.table, req.params.id );
        response.success( req, res, data, 200 );
    } catch (error) {
        next(error);
    }
};

/**
 * Routes
 */
router.get('/:table', list );
router.get('/:table/:id', get );
router.post('/:table', upsert );
router.put('/:table', update );
router.delete('/:table/:id', remove );

module.exports = router;
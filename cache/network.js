const express = require('express');

const response = require('../network/response');
const Store = require('../store/redis');

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

/**
 * Routes
 */
router.get('/:table', list );
router.get('/:table/:id', get );
router.post('/:table', upsert );

module.exports = router;
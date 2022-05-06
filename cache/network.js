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
        let data;
        if( !!req.params.id ) {
            switch( req.params.table ) {
                case 'auth':
                    data = await Store.get( req.params.table, req.params.id, 'username' );
                    break;
                default:
                    data = await Store.get( req.params.table, req.params.id, 'id' );
                    break;
            }
        } else if( !!req.params.username ) {
            data = await Store.get( req.params.table, req.params.username, 'username' );
        } else if( !!req.params.title ) {
            data = await Store.get( req.params.table, req.params.title, 'title' );
        } else if ( !!req.params.user_to ) {
            data = await Store.get( req.params.table, req.params.user_to, 'user_to' );
        } else {
            throw error( 'Endpoint not allowed', 500 );
        }

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
router.get('/:table/:id/:criteria', get );
router.post('/:table', upsert );

module.exports = router;
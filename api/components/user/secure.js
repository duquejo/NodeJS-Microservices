/**
 * Users Middleware
 */

const response = require('../../../network/response');
const auth = require('../../../auth/');

module.exports = checkAuth = ( action ) => {
    const middleware = ( req, res, next ) => {
        switch( action) {
            case 'update':
                auth.check.own( req, req.params.id );
                next();
                break;
            case 'follow':
                auth.check.logged( req );
                next();
                break;
            default: next();
        }
    };
    return middleware;
};

const JWT = require('jsonwebtoken');
const config = require('../config');
const error = require('../utils/error');

const secret = config.JWT.secret;

const sign = ( data ) => {
    return JWT.sign( data, secret);
};

const check = {
    own: ( req, owner ) => {
        const decoded = decodeHeader( req );
        if( decoded.id !== owner ) {
            throw error( 'The resource which you are trying to use is forbidden', 401 );
        }
    },
    logged: ( req, owner ) => decodeHeader( req ),
};

const verify = ( token ) => {
    try {
        return JWT.verify( token, secret )
    } catch (error) {
        throw error( error.message, 403 );
    }    
};

// Bearer token
const getToken = ( auth ) => {
    if ( ! auth ) {
        throw error( 'Required token', 401 );
    }

    if( auth.indexOf( 'Bearer ') === -1 ) {
        throw error( 'Invalid token format', 401 );
    }

    let token = auth.replace('Bearer ', '');

    return token;
};

const decodeHeader = ( req ) => {
    const authorization = req.headers.authorization || '';
    const token = getToken( authorization );
    const decoded = verify( token );

    req.user = decoded;

    return decoded;
};

module.exports = {
    sign,
    check,
}
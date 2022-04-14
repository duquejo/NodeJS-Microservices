/**
 * Servidor y todas las dependencias
 */
const express = require('express');
const swaggerUI = require('swagger-ui-express');

const config = require('../config');

const user = require('./components/user/network');
const auth = require('./components/auth/network');
const post = require('./components/post/network');

const swaggerDocument = require('./swagger.json');

const errors = require('../network/errors');

const app =  express();

/**
 * Routing
 */
app.use('/api/user', user );
app.use('/api/auth', auth );
app.use('/api/post', post );

const options = {
    swaggerOptions: {
        persistAuthorization: true
    }
};

/**
 * Swagger docs
 */
app.use('/api/doc', swaggerUI.serve, swaggerUI.setup( swaggerDocument, options ));

/**
 * Middleware
 */
 app.use( errors );


/**
 * Server listening
 */
app.listen( config.api.port, () => {
    console.log( `Listening on port ${ config.api.port }` );
} );
/**
 * Microservicio DB
 */

const express = require('express');
const config = require('../config');
const errors = require('../network/errors');
const router = require('./network');
const app =  express();

/**
 * Routing
 */
app.use('/', router );

app.use( errors );

/**
 * Server listening
 */
 app.listen( config.mysqlService.port, () => {
    console.log( `[DB Service] - Listening on port ${ config.mysqlService.port }` );
});
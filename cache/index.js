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
  app.listen( config.cacheService.port, () => {
     console.log( `[Cache Service] - Listening on port ${ config.cacheService.port }` );
 });
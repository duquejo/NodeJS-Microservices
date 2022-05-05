const mysql = require('mysql2');
const config = require('../config');

const USER_TABLE = 'user';

const dbConf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};

let connection;

const handleConnection = () => {
    connection = mysql.createConnection(dbConf);

    connection.connect( (error) => {
        if( error ) {
            console.error('[DB ERROR]', error );
            setTimeout( handleConnection, 2000 ); // Reconnect
        } else {
            console.log('[DB Connected]');
        }
    });

    connection.on( 'error', (error) => {
        console.error('[DB ERROR]', error );
        if( error.code === 'PROTOCOL_CONNECTION_LOST' ) {
            handleConnection();
        } else {
            throw error;
        }
    });
};

handleConnection();

/**
 * List
 */
const list = ( table ) => new Promise( ( resolve, reject ) => 
    connection.query( `SELECT * FROM ${ table }`, ( error, data ) => {
        if ( error ) {
            return reject( error );
        }
        resolve( data );  
    })
);

/**
 * Get
 */
const get = ( table, search, criteria ) => new Promise( ( resolve, reject ) => {

    const validCriteria = ['username', 'id', 'title', 'user_to'];

    if( ! validCriteria.includes( criteria ) ) {
        return reject({ 
            message: 'Not valid process, try again.', 
            statusCode: 400,
        });
    }

    const query = `SELECT * FROM ${ table } WHERE ${ criteria } = '${search }'`;
    connection.query( query, search, ( error, data ) => {
        if ( error ) {
            return reject( error );
        }
        resolve( data[0] );  
    });
});

/**
 * Upsert User/Auth
 */
const upsertUser = ( table, data ) => new Promise( async ( resolve, reject ) => {
    const exists = await get( table, data.username, 'username' );
    if( exists ) {
        return reject({ 
            message: 'This user already exists.', 
            statusCode: 409,
        });
    }
    connection.query( `INSERT INTO ${ table } SET ?`, data, ( error, result ) => {
        if ( error ) {
            return reject( error );
        }
        resolve({
            message: result,
            statusCode: 201
        });
    });
});

/**
 * Upsert Post
 */
const upsertPost = ( table, data ) => new Promise( async ( resolve, reject ) => {
    const exists = await get( table, data.title, 'title' );
    if( exists ) {
        return reject({ 
            message: 'This title actually exists, try another.', 
            statusCode: 409,
        });
    }
    connection.query( `INSERT INTO ${ table } SET ?`, data, ( error, result ) => {
        if ( error ) {
            return reject( error );
        }
        resolve({
            message: result,
            statusCode: 201
        });
    });
});

/**
 * Upsert Follower
 */
const upsertFollower = ( table, data ) => new Promise( async ( resolve, reject ) => {

    if( data.user_from === data.user_to ) {
        return reject({
            message: 'You cannot follow yourself, try again.',
            statusCode: 409,
        });
    }

    const exists = await get( USER_TABLE, data.user_to, 'id' );
    if( ! exists ) {
        return reject({ 
            message: 'Inexistent user to follow, try again.', 
            statusCode: 404,
        });        
    }

    const isVinculated = await get( table, data.user_to, 'user_to' );
    if( isVinculated ) {
        return reject({ 
            message: 'This new follower is actually vinculated to user', 
            statusCode: 409,
        });
    }
    connection.query( `INSERT INTO ${ table } SET ?`, data, ( error, result ) => {
        if ( error ) {
            return reject( error );
        }
        resolve({
            message: result,
            statusCode: 201
        });
    });
});

/**
 * Update
 */
const update = ( table, id, data ) => new Promise( async ( resolve, reject ) => {
    /**
     * Search by id first.
     */
     const exists = await get( table, id, 'id' );
     if( ! exists ) {
        return reject({ 
            message: 'The resource doesn\'t exists', 
            statusCode: 404,
        });
    }
    connection.query( `UPDATE ${ table } SET ? WHERE id = ?`, [ data, id ], ( error, result ) => {
        if ( error ) {
            return reject( error );
        }
        resolve( result );
    });
});

/**
 * Query
 */
const query = ( table, data, join ) => new Promise( async ( resolve, reject ) => {
    let joinQuery = '';
    if( join ) {
        joinQuery = `JOIN ${ join.table } ON ${ table }.${ join.on } = ${ join.table }.${ join.tableWhere }`;
    }
    const query = `SELECT * FROM ${ table } ${ joinQuery } WHERE ?`;
    console.log( query );
    connection.query( query, data, ( error, result ) => {
        if( error ) {
            return reject( error );
        }
        console.log( result );
        resolve( ( join ? result : result[0] ) || null );
    });
});

/**
 * Remove
 */
const remove = ( table, id ) => new Promise( async ( resolve, reject ) => {
    /**
     * Search by ID first.
     */
     const exists = await get( table, id, 'id' );
     if( ! exists ) {
         return reject({ 
             message: 'The resource which you are trying to remove doesn\'t exists.', 
             statusCode: 404,
         });
     }
     connection.query( `DELETE FROM ${ table } WHERE id = ?`, [ id ], ( error, result ) => {
         if ( error ) {
             return reject( error );
         }
         resolve({
             message: result,
             statusCode: 200
         });
     });
});

module.exports = {
    list,
    get,
    upsertUser,
    upsertFollower,
    upsertPost,
    update,
    query,
    remove
};
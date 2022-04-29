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
 * Get by ID
 */
const getById = ( table, id ) => new Promise( ( resolve, reject ) => {
    const query = `SELECT * FROM ${ table } WHERE id = '${id }'`;
    connection.query( query, id, ( error, data ) => {
        if ( error ) {
            return reject( error );
        }
        resolve( data[0] );  
    });
});

/**
 * Get by Username
 */
const getByUsername = ( table, username ) => new Promise( ( resolve, reject ) => {
    const query = `SELECT * FROM ${ table } WHERE username = '${ username }'`;
    connection.query( query, username, ( error, data ) => {
        if ( error ) {
            return reject( error );
        }
        resolve( data[0] );  
    });
});

/**
 * Get by Title
 */
const getByTitle = ( table, title ) => new Promise( ( resolve, reject ) =>
    connection.query( `SELECT * FROM ${ table } WHERE title = '${title }'`, title, ( error, data ) => {
        if ( error ) {
            return reject( error );
        }
        resolve( data[0] );
    })
);

/**
 * Get by user_to
 */
const getByUserTo = ( table, user_to ) => new Promise( ( resolve, reject ) =>
    connection.query( `SELECT * FROM ${ table } WHERE user_to = '${user_to }'`, user_to, ( error, data ) => {
        if ( error ) {
            return reject( error );
        }
        resolve( data[0] );  
    })
);


/**
 * Upsert User/Auth
 */
const upsertUser = ( table, data ) => new Promise( async ( resolve, reject ) => {
    const exists = await getByUsername( table, data.username );
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
    const exists = await getByTitle( table, data.title );
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

    const exists = await getById( USER_TABLE, data.user_to );
    if( ! exists ) {
        return reject({ 
            message: 'Inexistent user to follow, try again.', 
            statusCode: 404,
        });        
    }

    const isVinculated = await getByUserTo( table, data.user_to );
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
     const exists = await getById( table, id );
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
    connection.query( query, data, ( error, result ) => {
        if( error ) {
            return reject( error );
        }
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
     const exists = await getById( table, id );
     if( ! exists ) {
         return reject({ 
             message: 'The resource which you are trying to remove doesn\'t exists.', 
             statusCode: 409,
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
    getById,
    getByUsername,
    upsertUser,
    upsertFollower,
    upsertPost,
    update,
    query,
    remove
};
const mysql = require('mysql2');
const config = require('../config');

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
const list = ( table ) => new Promise( ( resolve, reject ) => {
    const query = `SELECT * FROM ${ table }`;
    connection.query( query, ( error, data ) => {
        if ( error ) {
            return reject( error );
        }
        resolve( data );  
    });
});

/**
 * Get
 */
const get = ( table, data ) => new Promise( ( resolve, reject ) => {

    let criteria, key;

    switch( table ) {
        case 'auth':
            criteria = data.username;
            key = 'username';
            break;
        case 'user_follow':
            criteria = data.user_to;
            key = 'user_to';
            break;
        default:
            criteria = data.id;
            key = 'id';
            break;
    }

    const query = `SELECT * FROM ${ table } WHERE ${ key } = '${ criteria }'`;
    connection.query( query, criteria, ( error, data ) => {
        if ( error ) {
            return reject( error );
        }
        resolve( data );  
    });
});

/**
 * Upsert
 */
const upsert = ( table, data ) => new Promise( async ( resolve, reject ) => {

    /**
     * Search by username first.
     */
    const exists = await get( table, data );
    if( exists.length ) {
        return reject({ 
            message: 'The resource that are you trying to insert already exists.', 
            statusCode: 409,
        });
    }

    const query = `INSERT INTO ${ table } SET ?`;
    connection.query( query, data, ( error, result ) => {
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
     const exists = await get( table, { id, ...data } );
     if( ! exists.length ) {
        return reject({ 
            message: 'User not exists', 
            statusCode: 404,
        });
    }

    let rest = data;
    if( table === 'user' ) {
        const { password, ...temp } = data;
        rest = temp;
    }

    const query = `UPDATE ${ table } SET ? WHERE id = ?`;
    connection.query( query, [ rest, id ], ( error, result ) => {
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

    // { user: 'user_to' }

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

module.exports = {
    list,
    get,
    upsert,
    update,
    query
};

const redis = require('redis');

const config = require('../config');

const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    legacyMode: true
});

client.connect();

const list = ( table ) => new Promise( async ( resolve, reject ) => {
    await client.get( table, ( error, data ) => {
        if( error ) return reject( error );
        
        let res = data || null;
        if( data ) {
            res = JSON.parse( data );
        } else {
            console.log(`[NOT-CACHED ${ table.toUpperCase() } REQUEST]: searching on DB.`);
        }
        resolve(res);
    });
});

const get = ( table, search, criteria ) => new Promise( async ( resolve, reject ) => {
    const validCriteria = ['username', 'id', 'title', 'user_to'];

    if( ! validCriteria.includes( criteria ) ) {
        return reject({ 
            message: 'Not valid process, try again.', 
            statusCode: 400,
        });
    }

    await client.get( table, ( error, data ) => {
        if( error ) return reject( error );
        
        let res = data || null;
        if( data ) {
            res = JSON.parse( data );
            if( res?.length > 0 ) {
                res = res.find( element => element[criteria] === search );
            }
        } else {
            console.log(`[NOT-CACHED ${ table.toUpperCase() } REQUEST]: searching on DB.`);
        }
        resolve(res);
    });
});

const upsert = async ( table, data ) => {
    let key = table;
    if( data && data.id ) {
        key = `${ key }'_'${ data.id }`;
    }
    client.setEx( key, 10, JSON.stringify( data ) );
    return true;
};

module.exports = {
    list,
    get,
    upsert,
};

const redis = require('redis');

const config = require('../config');

const client = redis.createClient({
    host: config.redis.host,
    // socket: {
    //     port: config.redis.port
    // },
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
            res = JSON.stringify( data );
        }
        resolve(res);
    } );
});

const get = ( table, id ) => {

};

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

const auth = require('../../../auth');
const bcrypt = require('bcrypt');
const error = require('../../../utils/error');

const AUTH_TABLE = 'auth';

module.exports = ( injectedStore ) => {

    let store = injectedStore;

    if( ! store ) {
        store = require('../../../store/dummy');
    }
    
    return {
        login: async ( username, password ) => {
            // Search user by username
            const data = await store.getByUsername( AUTH_TABLE, username );
            
            if( ! data ) {
                throw error( 'Unable to login, try again with a valid credentials', 403 );
            }

            const isValid = await bcrypt.compare( password, data.password );

            if( ! isValid ) {
                throw error( 'Invalid data', 401 );
            }

            return auth.sign( data );
        },        
        upsert: async ( data ) => {

            // Copy user data.
            const user = { id: data.id };

            if ( data.username ) {
                user.username = data.username;
            }
            if ( data.password ) {
                user.password = await bcrypt.hash( data.password, 5 );
            }
            return store.upsertUser( AUTH_TABLE, user );
        },
        update: async ( data ) => {
            // Copy user data.
            const user = { id: data.id };
            if ( data.username ) {
                user.username = data.username;
            }
            if ( data.password ) {
                user.password = await bcrypt.hash( data.password, 5 );
            }
            return store.update( AUTH_TABLE, user.id, user );
        },
        remove: async ( id ) => {
            return store.remove( AUTH_TABLE, id );
        },
    }
};

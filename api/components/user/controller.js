const nanoId = require('nanoid');
const error = require('../../../utils/error');
const auth = require('../auth');

const USER_TABLE = 'user';

module.exports = ( injectedStore ) => {

    let store = injectedStore;

    if( ! store ) {
        store = require('../../../store/dummy');
    }

    return {
        list: () => {
            return store.list( USER_TABLE );
        },
        get: ( id ) => {
            return store.getById( USER_TABLE, id );
        },
        upsert: async ( body ) => {

            const user = {
                name: body.name,
                username: body.username,
            };

            if( body.id ) {
                user.id = body.id;
            } else {
                user.id = nanoId.nanoid();
            }

            if( body.password || body.username ) {

                /**
                 * Login Auth Upsert
                 */
                await auth.upsert({
                    id: user.id,
                    username: user.username,
                    password: body.password
                });
            }
            return store.upsertUser( USER_TABLE, user );
        },
        remove: async ( id ) => {
            await auth.remove( id ); // Remove auth counterpart
            return store.remove( USER_TABLE, id );
        },
        update: async ( id, body ) => {

            
            if( ! id ) {
                throw error( 'The ID is required.');
            }
            
            const user = { id };

            if( body.name ) {
                user.name = body.name;
            }

            if( body.username ) {
                user.username = body.username;
            }

            if( body.password || body.username ) {

                /**
                 * Login Update.
                 */
                await auth.update({
                    id,
                    username: user.username,
                    password: body.password
                });
            }

            return store.update( USER_TABLE, id, user );
        },
        follow: ( from, to ) => {
            return store.upsertFollower( `${ USER_TABLE }_follow`, {
                user_from: from,
                user_to: to
            });
        },
        followers: ( id ) => {
            const join = {
                table: USER_TABLE,
                on: 'user_to',
                tableWhere: 'id' 
            };
            const query = { user_from: id };
            return store.query( `${ USER_TABLE }_follow`, query, join );
        },
    };
};


/**
 * @TODO Continuar implementación a remoteMySQL
 */
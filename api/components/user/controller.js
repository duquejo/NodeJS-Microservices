const nanoId = require('nanoid');
const error = require('../../../utils/error');
const auth = require('../auth');

const USER_TABLE = 'user';

module.exports = ( injectedStore, injectedCache ) => {

    let cache = injectedCache;
    let store = injectedStore;

    if( ! store ) {
        store = require('../../../store/dummy');
    }

    if( ! cache ) {
        cache = require('../../../store/dummy');
    }

    return {
        list: async () => {
            /**
             * 
             * Cache Strategy
             */
            let users = await cache.list( USER_TABLE );

            if( ! users ) {
                users = await store.list( USER_TABLE );
                cache.upsert( USER_TABLE, users );
            }

            return users;
        },
        get: async ( id ) => {

            /**
             * Cache GET Strategy
             */
            let user = await cache.get( USER_TABLE, id, 'id' );
            if( ! user ) {
                user = store.get( USER_TABLE, id, 'id' );
                const users = await store.list( USER_TABLE );
                cache.upsert( USER_TABLE, users );
            }

            return user;
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
                on: 'user_from',
                tableWhere: 'id' 
            };
            const query = { user_from: id };
            return store.query( `${ USER_TABLE }_follow`, query, join );
        },
    };
};
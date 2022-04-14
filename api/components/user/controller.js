const nanoId = require('nanoid');
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
            return store.get( USER_TABLE, id );
        },
        upsert: async ( body ) => {

            const user = {
                name: body.name,
                username: body.username,
            };

            if( body.id ) {
                user.id = body.id;
            } else {
                user.id = nanoId.nanoid()
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

            return store.upsert( USER_TABLE, user );
        },
        remove: ( id ) => {
            return store.remove( USER_TABLE, id );
        },
        update: async ( id, body ) => {

            const user = {
                id,
                name: body.name,
                username: body.username,
            };

            if( body.password || body.username ) {

                /**
                 * Login Update.
                 */
                await auth.update({
                    id: user.id,
                    username: user.username,
                    password: body.password
                });
            }

            return store.update( USER_TABLE, id, body );
        },
        follow: ( from, to ) => {
            return store.upsert( `${ USER_TABLE }_follow`, {
                user_from: from,
                user_to: to
            });
        },
        followers: ( id ) => {

            const join = {
                table: 'user',
                on: 'user_to',
                tableWhere: 'id' 
            };
            
            const query = { user_from: id };
            return store.query( `${ USER_TABLE }_follow`, query, join );
        },
    };
};

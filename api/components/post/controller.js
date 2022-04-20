const nanoId = require('nanoid');

const POST_TABLE = 'post';

module.exports = ( injectedStore ) => {

    let store = injectedStore;

    if( ! store ) {
        store = require('../../../store/dummy');
    }

    return {
        list: () => {
            return store.list( POST_TABLE );
        },
        get: ( id ) => {
            return store.get( POST_TABLE, id );
        },
        upsert: async ( userId, body ) => {

            const post = {
                title: body.title
            };

            if( body.content ) {
                post.content = body.content;
            }

            if( userId ) {
                post.user = userId;
            }

            if( body.id ) {
                post.id = body.id;
            } else {
                post.id = nanoId.nanoid();
            }

            return store.upsert( POST_TABLE, post );
        },
        remove: ( id ) => store.remove( POST_TABLE, id ),
        update: ( id, body ) => store.update( POST_TABLE, id, body )
    };
};

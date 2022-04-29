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
            return store.get( POST_TABLE, id, 'id' );
        },
        upsert: async ( body ) => {

            const post = {
                title: body.title
            };

            if( body.content ) {
                post.content = body.content;
            }

            if( body.user ) {
                post.user = body.user;
            }

            if( body.id ) {
                post.id = body.id;
            } else {
                post.id = nanoId.nanoid();
            }

            return store.upsertPost( POST_TABLE, post );
        },
        remove: ( id ) => store.remove( POST_TABLE, id ),
        update: ( id, body ) => store.update( POST_TABLE, id, body )
    };
};

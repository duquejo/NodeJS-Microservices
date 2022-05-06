const nanoId = require('nanoid');

const POST_TABLE = 'post';

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
            let posts = await cache.list( POST_TABLE );

            if( ! posts ) {
                posts = await store.list( POST_TABLE );
                cache.upsert( POST_TABLE, posts );
            }
 
            return posts;
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

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
    };
};

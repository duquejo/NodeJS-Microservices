const db = {
    'user': [],
};

const list = async ( table ) => {

    // Return current list
    return db[table] || [];
};

const get = async ( table, id ) => {

    // Get current list
    let collection = await list(table);

    // Search & return list (If exists)
    return collection.find( item => item.id === id ) || null;
};

const upsert = async ( table, data ) => {

    // If table doesn't exists
    if( !db[table] ) {
        db[table] = [];
    }

    // Add user
    db[table].push(data);

    console.log( 'table', db );

    // Return DB
    return db[table];
};

/**
 * Update
 */
const update = async ( table, id, body ) => {

    // Search item
    if( ! db[table].length ) {
        throw new Error( 'No DB items for update' );
    }

    const item = await get( table, id );
    if( ! item ) {
        throw new Error( 'Item not found');
    }

    // Update item
    const updatedItems = db[table].map( item => item.id !== id ? item : { 
        id, 
        ...item, 
        ...body
    });

    console.log( {updatedItems} );
    
    // Update DB    
    db[table] = updatedItems;

    return 'Success';
}

/**
 * Remove
 */
const remove = async ( table, id ) => {

    // Get user
    const user = await get( table, id);
    
    // Return feedback
    if( ! user ) {
        throw new Error(`User {${ id }} isn\'t found`);
    }

    // Filter items
    const filteredItems = db[table].filter( item => item.id !== id );

    // Update DB
    db[table] = filteredItems;

    return user;
};

const query = async ( table, q ) => {

    // Get current list
    let collection = await list(table);

    let keys = Object.keys( q );
    let key = keys[0];

    // Search & return list (If exists)
    return collection.filter( item => item[key] === q[key] )[0] || null;
}

module.exports = {
    list,
    get,
    upsert,
    remove,
    query,
    update
};

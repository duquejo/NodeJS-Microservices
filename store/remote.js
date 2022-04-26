const axios = require('axios').default;

class createRemoteDB {

    constructor( host, port ) {
        this.axiosInstance = axios.create({
            baseURL: `http://${ host }:${ port }/`,
            headers: { 'content-type': 'application/json' },
        });
    }

    /**
     * List Method
     * @param {*} table 
     * @returns 
     */
    list = ( table ) => this.defaultReq( 'GET', table);

    /**
     * Get Method
     * @param {*} table 
     * @param {*} id 
     * @returns 
     */
    get = ( table, criteria ) => this.pathReq( 'GET', table, criteria );
    
    /**
     * Upsert Method
     * @param {*} table 
     * @param {*} data 
     * @returns 
     */
    upsert = ( table, data ) => this.defaultReq( 'POST', table, data );
    
    /**
     * Remove Method
     * @param {*} table 
     * @param {*} query 
     * @param {*} join 
     */
    remove = ( table, id ) => this.pathReq( 'DELETE', table, { id } );

    /**
     * Update Method
     * @param {*} method 
     * @param {*} table 
     * @param {*} data 
     * @returns 
     */
    update = ( table, data ) => this.pathReq( 'PUT', table, data );

    /**
     * Query Method
     * @param {*} method 
     * @param {*} table 
     * @param {*} data 
     * @returns 
     */
    query = ( table, data ) => this.defaultReq( 'GET', table, data );
    
    pathReq = ( method, table, data ) => {

        let url = `/${ table }/${ data.id }`;

        console.log( 'PATH REQ', { method, table, data, url } );
        
        return new Promise( async ( resolve, reject ) => {
            try {
                const request = await this.axiosInstance.request({ method, url, data });
                const { data: { body } } = request;
                return resolve( body );
            } catch (error) {
                // console.error( '[REMOTE DB]:', error );
                return reject({
                    message: error.response.data.body,
                    statusCode: error.response.data.status,
                });            
            }
        });
    };

    defaultReq = ( method, table, data ) => {

        let url = `/${ table }`;

        console.log( 'DEFAULT REQ', { method, table, data, url } );
        
        return new Promise( async ( resolve, reject ) => {
            try {
                const request = await this.axiosInstance.request({ method, url, data });
                const { data: { body } } = request;
                return resolve( body );
            } catch (error) {
                console.error( '[REMOTE DB]:', error );
                return reject({
                    message: error.response.data.body,
                    statusCode: error.response.data.status,
                });            
            }
        });
    };    


    // query = ( table, query, join ) => this.req( 'DELETE', table, );    
}

/**
 * @TODO MEJORAR Y COMPLEMENTAR
 */

// const createRemoteDB = ( host, port ) => {
//     const URL = `http://${ host }:${ port }`;

//     const list = ( table ) => {
//         return req('GET', table);
//     };

//     const req = ( method, table, data ) => {
//         let url = `${URL}/${ table }`;
//         let body = '';
//         return new Promise( ( resolve, reject ) => {
//             request({
//                 method,
//                 headers: {
//                     'content-type': 'application/json'
//                 },
//                 url,
//                 body
//             }, ( err, req, body ) => {
//                 if( err ) {
//                     console.error( '[REMOTE DB]: Error', err );
//                     return reject( err.message );
//                 }

//                 const response = JSON.parse( body );
//                 return resolve( response.body );
//             });
//         });
//     };

//     // const get = ( table, id ) => {};
//     // const upsert = ( table, data ) => {};
//     // const query = ( table, query, join ) => {};
// };

module.exports = createRemoteDB;
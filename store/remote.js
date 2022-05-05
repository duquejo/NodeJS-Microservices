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
    get = ( table, id, criteria ) => this.getCriteriaReq( 'GET', table, id, criteria );

    /**
     * Upsert Method
     * @param {*} table 
     * @param {*} data 
     * @returns 
     */
    upsert = ( table, data ) => this.defaultReq( 'POST', table, data );
    upsertUser = ( table, user ) => this.defaultReq( 'POST', table, user );
    upsertPost = ( table, post ) => this.defaultReq( 'POST', table, post );
    upsertFollower = ( table, user ) => this.addFollowerReq( 'POST', table, user );
    
    /**
     * Remove Method
     * @param {*} table 
     * @param {*} query 
     * @param {*} join 
     */
    remove = ( table, id ) => this.pathReq( 'DELETE', table, id );

    /**
     * Update Method
     * @param {*} method 
     * @param {*} table 
     * @param {*} data 
     * @returns 
     */
    update = ( table, id, user ) => this.updateReq( 'PUT', table, id, user );

    /**
     * Query Method
     * @param {*} method 
     * @param {*} table 
     * @param {*} data 
     * @returns 
     */
    query = ( table, query, join ) => this.getFollowersReq( 'GET', table, query, join );
    

    updateReq = ( method, table, id, data ) => {

        let url = `/${ table }/${ id }`;
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

    pathReq = ( method, table, id ) => {

        let url = `/${ table }/${ id }`;
        return new Promise( async ( resolve, reject ) => {
            try {
                const request = await this.axiosInstance.request({ method, url, id });
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

    getCriteriaReq = ( method, table, id, criteria ) => {

        let url = `/${ table }/${ id }/${ criteria }`;
        return new Promise( async ( resolve, reject ) => {
            try {
                const request = await this.axiosInstance.request({ method, url, id });
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

    defaultReq = ( method, table, data ) => {

        let url = `/${ table }`;
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
    
    addFollowerReq = ( method, table, data ) => {

        let url = `/${ table }/follow/${ data.user_to }`;
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

    getFollowersReq = ( method, table, query, join ) => {

        let url = `/${ table }/${ query.user_to }/followers`;
        return new Promise( async ( resolve, reject ) => {
            try {
                const request = await this.axiosInstance.request({ method, url, data: { query, join } });
                const { data: { body } } = request;
                return resolve( body );
            } catch (error) {
                console.error( '[REMOTE DB]:', error.response );
                return reject({
                    message: error.response.data.body,
                    statusCode: error.response.data.status,
                });            
            }
        });
    };
}

module.exports = createRemoteDB;
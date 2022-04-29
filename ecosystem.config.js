module.exports = {
    apps : [{
        name   : 'API Server',
        script : './api/index.js',
    },{
        name   : 'DB Server',
        script : './mysql/index.js',     
    },{
        name   : 'Cache Server',
        script : './cache/index.js',     
    }]
};

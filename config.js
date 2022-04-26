module.exports = {
    api: {
        port: process.env.API_PORT || 3005
    },
    JWT: {
        secret: process.env.JWT_SECRET ||'secretPassword'
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'micro-container',
        password: process.env.MYSQL_PASSWORD || 'micro-container',
        database: process.env.MYSQL_DATABASE || 'micro-container',
    },
    mysqlService: {
        port: process.env.MYSQL_SRV_PORT || 3006,
        host: process.env.MYSQL_SRV_HOST || 'localhost',
    },
    cacheService: {
        port: process.env.MYSQL_SRV_PORT || 3007,
        host: process.env.MYSQL_SRV_HOST || 'localhost',
    },
    redis: {
        host:  process.env.REDIS_SRV_HOST ||'localhost',
        port: process.env.REDIS_SRV_PORT || '6379',
        password: process.env.REDIS_SRV_PASSWORD || 'MDNcVb924a'
    }
}
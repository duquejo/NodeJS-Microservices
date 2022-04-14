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
    }
}
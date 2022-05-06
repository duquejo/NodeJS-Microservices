const controller = require('./controller');
// const store = require('../../../store/mysql');

const store = require('../../../store/remote-mysql');
const cache = require('../../../store/remote-redis');

module.exports = controller( store, cache );

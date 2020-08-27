const config = require('./knexfile');
const knex = require('knex')(config);

console.log('DATABASE CONNECTED')

module.exports= knex;
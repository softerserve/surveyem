// keys.js - figure out which keys to return.. deve or product

if (process.env.NODE_ENV === 'production') {
	// production mode
	module.exports = require('./prod');
} else {
	// development mode
	module.exports = require('./dev');
}
/******************************************************************************
 *
 * ***************************************************************************/
"use strict"

/*****************************************************************************/
const http = require('http')
const debug = require('debug')('bambi')
/*****************************************************************************/

const normalizePort = function(val) {
    let port = parseInt(val, 10)
    if (isNaN(port)) return val
    if (port >= 0) return port
    return false
}

const onError = function(port, error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

const onListening = function(addr) {
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}

const httpServer = function({
    app,
    port
}) {

    let _port = normalizePort(process.env.PORT || port)
    app.set('port', _port)

    let _server = http.createServer(app)
    _server.listen(_port)
    _server.on('error', x => onError(_port))
    _server.on('listening', x => onListening(_server.address()))
    console.log(`App running on port ${_port}`)

    return {
        on: (message, callback) => _server.on(message, callback),
        address: _ => _server.address(),
        port: _port,
        server: _ => _server
    }
}


module.exports = {
    httpServer
}

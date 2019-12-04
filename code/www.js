const app = require('./app')
const http = require('http')

const serverUtils = require('./serverUtils').serverUtils

const port = serverUtils.normalizePort(process.env.PORT || '3000')

app.set('port', port)
console.log(`App running on port ${port}`)

const server = http.createServer(app)
server.listen(port)





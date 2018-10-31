const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
// const StringDecoder = require('string_decoder').StringDecoder
// const routerText = new StringDecoder('utf8')
var connections = []

app.use(express.static(__dirname + '/'))

server.listen(3000, () => {
	console.log('webApp listening on port 3000')
})

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
	connections.push(socket)
	console.log(`server: connections = ${connections.length}`)

	socket.on('disconnect', function (socket) {
		connections.splice(connections.indexOf(socket), 1)
		console.log(`server: connections = ${connections.length}`)
	})
})



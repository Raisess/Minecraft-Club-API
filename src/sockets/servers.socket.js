const servers = require('../models/servers.module.js');

module.exports = (io, socket) => {

	socket.on('create-server', data => {
		servers.create(data);
		socket.emit('get-servers', data.a);
	});

	socket.on('get-servers', type => {
		servers.get(type, serversList => socket.emit('getted-servers', serversList));
	});

}
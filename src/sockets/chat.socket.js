module.exports = (io, socket) => {

	socket.on('msg-send', msg => {
		//console.log(msg);
		if(msg.content !== ''){
			io.emit('msg-sended', msg);
		}
	});

}
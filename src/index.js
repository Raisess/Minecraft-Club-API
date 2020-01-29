const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const firebase = require('firebase');
const fbConfig = require('./database/firebase.js');
const fb = firebase.initializeApp(fbConfig);
const port = 1939 || process.env.PORT;

const users = require('./models/users.module.js');
const servers = require('./models/servers.module.js');

const serversSocket = require('./sockets/servers.socket.js');
const chatSocket = require('./sockets/chat.socket.js');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.status(200).json({ status: 200, log: 'api ok!' }));

app.post('/signup?', (req, res) => {
	let data = {
		email: req.query.email,
		nick: req.query.nick,
		pass: req.query.pass
	};

	users.create(data);

	return res.status(200).json({ status: 200, log: 'user inserted!' });
});

app.get('/signin?', (req, res) => {
	let data = {
		nickname: req.query.nick,
		pass: req.query.pass
	};

	users.get(data, user => {
		if(user === 'undefined'){
			return res.status(300).json({ status: 300, log: 'user not exists!', exists: false });
		}
		else{
			let passSize = user.pass.length;
			let criptPass = [];
			for(let i = 0; i < passSize; i++){
				criptPass.push('*');
			}
			user.pass = criptPass.join('');

			return res.status(200).json({ status: 200, log: 'user exists!', exists: true, data: user });
		}
	});
});

app.get('/serverinfo?', (req, res) => {
	let address = req.query.address;
	let type = req.query.type;

	servers.getInfo(address, type, info => {
		return res.status(200).json({ status: 200, log: 'server exists!', exists: true, data: info });
	});
});

let connectedClients = 0;

io.on('connection', socket => {

	connectedClients+=1;
	//console.log(`connected clients: ${connectedClients}`);

	serversSocket(io, socket);
	chatSocket(io, socket);

	socket.on('disconnect', () => {
		connectedClients-=1;
		//console.log(`connected clients: ${connectedClients}`);
	});

});

http.listen(port, () => console.log(`Running in port: ${port}`));
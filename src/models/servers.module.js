const fb = require('firebase');
const db = fb.database();

module.exports = {
	create: data => {
		db.ref(`servers/${data.a}`).push({
			a: data.a,
			creator: data.creator,
			address: data.address,
			name: data.name,
			description: data.description,
			pass: data.pass,
			type: data.type
		});
	},
	get: (type, callback) => {
		db.ref(`servers/${type}`).once('value').then(snap => {
			let servers = Object.values(snap.val()) || 'undefined';

			return callback(servers);
		});
	},
	getInfo: (address, type, callback) => {
		db.ref(`servers/${type}`).once('value').then(snap => {
			let servers = Object.values(snap.val()) || 'undefined';

			for(let i = 0; i < servers.length; i++){
				if(servers[i].address === address){
					return callback(servers[i]);
				}
			}
		});
	}
}
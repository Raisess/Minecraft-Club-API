const fb = require('firebase');
const db = fb.database();

module.exports = {
	create: data => {
		db.ref('users/').push({
			email: data.email,
			nickname: data.nick,
			pass: data.pass
		});
	},
	get: (data, callback) => {
		db.ref('users/').once('value').then(snap => {
			let users = Object.values(snap.val()) || 'undefined';

			//console.log(users);

			for(let i = 0; i < users.length; i++){
				if(users[i].nickname === data.nickname){
					if(users[i].pass === data.pass){
						return callback(users[i]);
					}
				}
			}

			return callback('undefined');
		});
	}
}
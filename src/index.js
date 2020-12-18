const BACKEND_URL = "http://localhost:3000";
let session;

document.addEventListener("DOMContentLoaded", () => {
	button = document.getElementById('login_form');
	button.addEventListener('submit', function() {
		login();
	}, false);
	restoreSession()
});

class Session {
	constructor(username, user_id, token){
		this.username = username;
		this.user_id = user_id;
		this.token = token;
	}

	save() {
		console.log('saving')
		localStorage.token = this.token
		this.switchLoginLogout()
	}

	logout() {
		delete localStorage.session
		this.switchLoginLogout()
	}

	switchLoginLogout() {
		const form = document.getElementById('login_form');
		const logout = document.getElementById('logout');
		const username_label = document.getElementById('username_label');
		if (form.style.display == '') {
			form.style.display = 'none';
			logout.style.display = 'block';
			username_label.innerHTML = `<b>${this.username}</b>`;
			username_label.style.display = 'block';
		} else {
			form.style.display = '';
			logout.style.display = 'none';
			username_label.style.display = 'none';
		}
	}
}

class User {
	constructor(username, password){
		this.username = username;
		this.password = password;
	}

	post() {
		fetch(`${BACKEND_URL}/users`,{
	    method:'POST',
	    headers: {
	      "Content-Type":"application/json",
	      "Accept": "application/json"
	    },
	    body: JSON.stringify(this)
	  })
	  .then(resp=>resp.json())
	  .then(obj=> {
	  	console.log(obj);
	  	if (JSON.stringify(obj.errors) === JSON.stringify({})) {
				session = new Session(obj.username, obj.id, obj.token)
				session.save()
			}
			else {
				displayLoginError(obj);
			}
	  })
	}
}

function displayLoginError(obj) {
	document.getElementById('username').value = '';
	document.getElementById('password').value = '';
	if (obj.errors.password) {
		document.getElementById('password').placeholder = obj.errors.password;
	} 
	if (obj.errors.username) {
		document.getElementById('username').placeholder = obj.errors.username;
	} else {
		document.getElementById('username').value = obj.user.username;
	}
}

function login() {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const user = new User(username, password);
	user.post()
}

function restoreSession() {
	const token = localStorage.token
	if (token) {
		session = new Session(savedSession.username, savedSession.user_id, savedSession.token)
	}
}

function post() {
	fetch(`${BACKEND_URL}/users/2`,{
    method:'GET',
    headers: {
 			"Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.7NrXg388OF4nBKLWgg2tdQHsr3HaIeZoXYPisTTk-48",
      "Content-Type":"application/json",
      "Accept": "application/json"
    },
  })
  .then(resp=>resp.json())
  .then(obj=> {
  	console.log(obj);
  })
}
const BACKEND_URL = "http://localhost:3000";
let session;

document.addEventListener("DOMContentLoaded", () => {
	if (!localStorage.session) {
		button = document.getElementById('login_form');
		button.addEventListener('submit', function() {
			login();
		}, false)
	}
	
});

class Session {
	constructor(username, password){
		this.username = username;
		this.password = password;
		this.jwt = null;
	}

	postUser() {
		fetch(`${BACKEND_URL}/users`,{
	    method:'POST',
	    headers: {
   			// "Authorization": `Bearer ${localStorage.getItem('token')}`,
	      "Content-Type":"application/json",
	      "Accept": "application/json"
	    },
	    body: JSON.stringify(this)
	  })
	  .then(resp=>resp.json())
	  .then(obj=> {
	  	console.log(obj);
	  	if (JSON.stringify(obj.errors) === JSON.stringify({})) {
				switchLoginLogout(obj.user.username);
				this.jwt = obj.jwt;
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
	const session = new Session(username, password);
	session.postUser()
}

function switchLoginLogout(username) {
	const form = document.getElementById('login_form');
	const logout = document.getElementById('logout');
	const username_label = document.getElementById('username_label');
	if (form.style.display == '') {
		form.style.display = 'none';
		logout.style.display = 'block';
		username_label.innerHTML = `<b>${username}</b>`;
		username_label.style.display = 'block';
	} else {
		form.style.display = '';
		logout.style.display = 'none';
		username_label.style.display = 'none';
	}
}
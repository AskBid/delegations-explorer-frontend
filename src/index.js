const BACKEND_URL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded", () => {
	button = document.getElementById('login_form');
	button.addEventListener('submit', function() {
		login()
	}, false)
});

class User {
	constructor(username, password){
		this.username = username;
		this.password = password
	}

	post() {
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
	  	console.log(obj)
	  	debugger
	  	if (obj.user) {
	  		debugger
				switchLoginLogout(obj.user.username)
			}
			else {displayLoginError()}
	  })
	}
}

function displayLoginError() {
	document.getElementById('username').value = '';
	document.getElementById('password').value = '';
	document.getElementById('username').placeholder = 'username already used';
	document.getElementById('password').placeholder = 'OR wrong password';
}

function login() {
	username = document.getElementById('username').value;
	password = document.getElementById('password').value;
	user = new User(username, password)
	user.post()
}

function switchLoginLogout(username) {
	form = document.getElementById('login_form');
	logout = document.getElementById('logout');
	username_label = document.getElementById('username_label');
	if (form.style.display == '') {
		form.style.display = 'none'
		logout.style.display = 'block'
		debugger
		username_label.innerHTML = `<b>${username}</b>`
		username_label.style.display = 'block'
	} else {
		form.style.display = ''
		logout.style.display = 'none'
		username_label.style.display = 'none'
	}
}
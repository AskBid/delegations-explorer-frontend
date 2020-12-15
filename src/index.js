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

	post(){
		fetch(`${BACKEND_URL}/users`,{
	    method:'POST',
	    headers: {
	      "Content-Type":"application/json",
	      "Accept": "application/json"
	    },
	    body: JSON.stringify(this)
	  })
	  .then(resp=>resp.json())
	}
}

function login() {
	username = document.getElementById('username').value;
	password = document.getElementById('password').value;
	user = new User(username, password)
	debugger
}

function switchLoginLogout() {
	form = document.getElementById('login_form');
	logout = document.getElementById('logout');
	if (form.style.display == '') {
		form.style.display = 'none'
		logout.style.display = 'block'
	} else {
		form.style.display = ''
		logout.style.display = 'none'
	}
}
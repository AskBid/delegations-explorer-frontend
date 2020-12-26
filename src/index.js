const BACKEND_URL = "http://localhost:3000";
let session;

document.addEventListener("DOMContentLoaded", () => {
	let button = document.getElementById('login_form');
	button.addEventListener('submit', function(event) {
		event.preventDefault()
		login()
	});

	button = document.getElementById('logout');
	button.addEventListener('click', function(event) {
		event.preventDefault()
		if (session) {session.logout()}
	});

	button = document.getElementById('add_stake');
	button.addEventListener('submit', function(event) {
		event.preventDefault()
		if (session) {
			const value = this.getElementsByTagName('input')[0].value;
			postStakeAndRender(value);
		} else {
			inviteToLogin()
		}
	});

	button = document.getElementById('add_pool');
	button.addEventListener('submit', function(event) {
		event.preventDefault();
		if (session) {
			const value = this.getElementsByTagName('input')[0].value;
			postFollowedPoolsAndRender(value);
		} else {
			inviteToLogin()
		}
	});

	button = document.getElementById('prev');
	button.addEventListener('click', function(event) {
		event.preventDefault();
		changeEpoch(this);
	});

	button = document.getElementById('next');
	button.addEventListener('click', function(event) {
		event.preventDefault();
		changeEpoch(this);
	});

	(async ()=> {
		const tickers = await getPools();
		autocomplete(document.getElementById("insert_pool"), tickers);
		await fetchEpochInfo();
		await restoreSession();
		if (session) {
			render()
		} else {
			renderInstruction()
		}
	})()
});

function inviteToLogin() {
	// debugger
	if (document.getElementById('login_form').style.backgroundColor === "rgba(255, 149, 0, 0.9)" || "") {
		document.getElementById('login_form').style.backgroundColor = "rgba(10, 255, 190,0.9)";
	} else {
		document.getElementById('login_form').style.backgroundColor = "rgba(255, 149, 0, 0.9)"
	}
}

function getPools() {
	return fetch(`${BACKEND_URL}/pools`, {
		method:'GET',
	  headers: {
      "Content-Type":"application/json",
      "Accept": "application/json"
    }
	}).then(resp=>resp.json())
	  .then(obj=> {
	  	const tickers = obj.map(obj=>obj.ticker)
	  	return tickers
	  })
}

function login() {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const user = new User(username, password);
	document.getElementById('login_form').style = "";
	user.post()
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
	  	if (obj.token) {
				session = new Session(obj.username, obj.id, obj.token)
				session.save()
				render()
			}
			else {
				displayLoginError(obj);
			}
	  })
	}
}

class Session {
	constructor(username, user_id, token){
		this.username = username;
		this.user_id = user_id;
		this.token = token;
	}

	save() {
		localStorage.token = this.token
		this.switchLoginLogout()
	}

	logout() {
		delete localStorage.token;
		session = undefined;
		this.switchLoginLogout();
		render();
	}

	switchLoginLogout() {
		const form = document.getElementById('login_form');
		const logout = document.getElementById('logout');
		const username_label = document.getElementById('username_label');
		if (form.style.display == '') {
			form.style.display = 'none';
			logout.style.display = 'block';
			username_label.innerHTML = `@<b>${this.username}</b>`;
			username_label.style.display = 'block';
		} else {
			form.style.display = '';
			logout.style.display = 'none';
			username_label.style.display = 'none';
		}
	}
}

function displayLoginError(obj) {
	if (obj.errors.password) {
		document.getElementById('password').value = '';
		document.getElementById('password').placeholder = obj.errors.password;
	} 
	if (obj.errors.username) {
		document.getElementById('username').value = '';
		document.getElementById('username').placeholder = obj.errors.username;
	}
}

function restoreSession() {
	const token = localStorage.token
	if (token) {
		return fetch(`${BACKEND_URL}/login`,{
	    method:'GET',
	    headers: {
	 			"Authorization": `${token}`,
	      "Content-Type":"application/json",
	      "Accept": "application/json"
	    },
	  })
	  .then(resp=>resp.json())
	  .then(obj=> {
	  	session = new Session(obj.username, obj.id, token);
	  	session.save()
	  })
	}
}

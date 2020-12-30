class AppStorage {
	static BACKEND_URL() {
    return "http://52.56.73.140:3003"
  };

  static setSession(session) {
  	this.session = session
  }

  static getSession(session) {
  	return this.session
  }
}



class User {
	constructor(username, password){
		this.username = username;
		this.password = password;
	}

	post() {
		fetch(`${AppStorage.BACKEND_URL()}/users`,{
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

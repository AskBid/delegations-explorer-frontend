const BACKEND_URL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded", () => {

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
	
	hideLoginFields()
	switchLoginButton()
}



function hideLoginFields() {
	inputs = document.getElementById('login_fields').getElementsByTagName('input');
	[...inputs].forEach( input => input.style.display = "none");
}

function switchLoginButton() {
	button = document.getElementById('login_area').getElementsByClassName('login_button')[0];
	button.innerHTML = button.innerHTML == 'submit' ? 'logout' : 'submit';
}
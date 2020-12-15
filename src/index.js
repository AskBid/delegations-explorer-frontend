const BACKEND_URL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded", () => {

});


function login() {
	fetch(`${BACKEND_URL}/users`,{
    method:'POST',
    headers: {
      "Content-Type":"application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(json)
  })
  .then(resp=>resp.json())

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
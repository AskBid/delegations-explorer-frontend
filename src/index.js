const BACKEND_URL = "http://localhost:3000"

document.addEventListener("DOMContentLoaded", () => {

});


function hideLoginFields() {
	inputs = document.getElementById('login_fields').getElementsByTagName('input');
	[...inputs].forEach( input => input.style.display = "none");
}

function switchLoginButton() {
	button = document.getElementById('login_area').getElementsByClassName('login_button')[0];
	button.innerHTML = button.innerHTML == 'submit' ? 'logout' : 'submit';
}
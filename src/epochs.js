class Epoch {
	constructor(min, max, current) {
		this.min = min;
		this.max = max;
		this.current = current;
	}
	move(move) {
		if (this.current + move <= this.max && this.current + move >= this.min) {
			this.current += move
		}
	}
}

function fetchEpochInfo() {
	return fetch(`${AppStorage.BACKEND_URL()}/epoch`,{
    method:'GET',
    headers: {
      "Content-Type":"application/json",
      "Accept": "application/json"
    },
  })
  .then(resp=>resp.json())
  .then(obj=> {
  	AppStorage.epoch = new Epoch(obj.min, obj.max, obj.max);
  	displayEpoch()
  	checkEpochButtonState()
  })
}

function changeEpoch(element) {
	let move = element.id === 'next' ? 1 : -1
	AppStorage.epoch.move(move);
	displayEpoch();
	checkEpochButtonState();
	render();
}

function displayEpoch() {
	if (AppStorage.epoch) {
		document.getElementById('epoch').innerHTML = `epoch ${AppStorage.epoch.current}`;
	} else {
		document.getElementById('epoch').innerHTML = `null epoch!`;
	}
}

function checkEpochButtonState() {
	if (AppStorage.epoch.current === AppStorage.epoch.max) {
			document.getElementById("next").disabled = true;
	} else {
			document.getElementById("next").disabled = false;
	}
	if (AppStorage.epoch.current === AppStorage.epoch.min) {
		document.getElementById("prev").disabled = true;
	} else {
		document.getElementById("prev").disabled = false;
	}
}
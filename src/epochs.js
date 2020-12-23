let epoch = null

class Epoch {
	constructor(min, max, current) {
		this.min = min;
		this.max = max;
		this.current = current;
	}

	move(move) {
		if (this.current + move < max && this.current + move > min) {
			this.current += move
		}
	}
}

function fetchEpochInfo() {
	fetch(`${BACKEND_URL}/epoch`,{
    method:'GET',
    headers: {
      "Content-Type":"application/json",
      "Accept": "application/json"
    },
  })
  .then(resp=>resp.json())
  .then(obj=> {
  	epoch = new Epoch(obj.min, obj.max, obj.max);
  	checkEpochButtonState()
  })
}

function changeEpoch(element) {
	let move = element.div == 'next' ? 1 : -1
	epoch.move(move)
	checkEpochButtonState()
}

function checkEpochButtonState() {
	if (this.current === max) {
			document.getElementById("next").disabled = true;
	} else (this.current != max) {
			document.getElementById("next").disabled = false;
	}
	if (this.current === min) {
		document.getElementById("prev").disabled = true;
	} else (this.current === min) {
		document.getElementById("prev").disabled = false;
	}
}
let epoch = new Epoch()

class Epoch {
	constructor(min, max) {
		this.min = min;
		this.max = max;
		this.current = max;
	}

	set current() {}
	get current() {}
}

function fetchEpochInfo() {

}
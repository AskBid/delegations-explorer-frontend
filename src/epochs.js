let epoch = null

class Epoch {
	constructor(min, max, current) {
		this.min = min;
		this.max = max;
		this.current = current;
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
  })
}
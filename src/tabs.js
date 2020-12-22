function getStakes() {
	const token = session.token
	fetch(`${BACKEND_URL}/users/${session.user_id}/stakes`,{
    method:'GET',
    headers: {
    	"Authorization": `${token}`,
      "Content-Type":"application/json",
      "Accept": "application/json"
    }
  }).then(resp=>resp.json())
  	.then(obj=> {
  		console.log(obj);
		})
};

function postFollowedPool(ticker_field) {
	const ticker = ticker_field.value;
	const token = session.token;
	fetch(`${BACKEND_URL}/users/${session.user_id}/pools`,{
    method:'POST',
    headers: {
    	"Authorization": `${token}`,
      "Content-Type":"application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({stake: stake_addr})
  }).then(resp=>resp.json())
  	.then(obj=> {
  		console.log(obj);
		})
}


function postStake(addr_field) {
	const stake_addr = addr_field.value;
	const token = session.token;
	fetch(`${BACKEND_URL}/users/${session.user_id}/stakes`,{
    method:'POST',
    headers: {
    	"Authorization": `${token}`,
      "Content-Type":"application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({stake: stake_addr})
  }).then(resp=>resp.json())
  	.then(obj=> {
  		console.log(obj);
		})
}


class String_to_html {
	buildHTML(html_string) {
		const parser = new DOMParser();
		const domString = html_string;
		var html = parser.parseFromString(domString, 'text/html');    
		return html.body.firstChild
	};
}



class Tab extends String_to_html {
	constructor(stakeID, ticker) {
		super();
		this.stakeID = stakeID;
		this.tab = this.base_tab();
		this.mainSubTab = this.add_sub_tab(ticker);
	};

	base_tab() {
  	const html_string = `
			<div class='tab' id='${this.stakeID}'>
			</div>`;
		return super.buildHTML(html_string)
	};

	add_sub_tab(ticker) {
		const subTab = new SubTab(ticker);
		this.tab.appendChild(subTab.tab);
		return subTab
	};

	inject() {
		const tabs_target = document.getElementById('tabs_target')
		tabs_target.appendChild(this.tab)
	};
}



class SubTab extends String_to_html {
	constructor(ticker) {
		super();
		this.tab = this.base_tab(ticker);
	}

	base_tab(ticker) {
  	const html_string =`
			<div class='sub_tab'>
				<button class='x'></button>
				<div class='tab_pool_values'>
			    <div class='pool_ticker'>${ticker}</div>
				</div> 
				<div class='tab_values'></div>
			</div>`
		return super.buildHTML(html_string) 
	};

	set ticker(ticker) {
		const div = this.tab.getElementsByClassName('pool_ticker')[0]
		div.innerHTML = ticker
	}

	addValue(label, value) {
		const row = new ValueRow(label, value)
		const div = this.tab.getElementById('tab_values')
		div.appendChild(row)
	}
};



class ValueRow extends String_to_html {
	constructor(label, value, symbol = '₳') {
		super()
		this.label = label;
		this.value = value;
		this.symbol = symbol;
	}

	build_row() {
		html_string = `
			<div class='row'>
		      <div class='tab_label'>${this.label}:</div>
		      <div class='tab_value'>${this.value}${this.symbol}</div>
		  </div>`
		return super.buildHTML(html_string) 
	};
}
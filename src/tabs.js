async function render() {
	if (AppStorage.session) {
		const activeStakes = await getActiveStakes();
		const followedPools = await getFollowedPools();
		emptyTabs();
		if (activeStakes === undefined || activeStakes.length == 0) {
			renderInstruction()
		} else {
			renderTabs(activeStakes, followedPools);
		}
	} else {
		renderInstruction()
	}
}

function emptyTabs() {
	const tabs_target = document.getElementById('tabs_target')
	tabs_target.innerHTML = '';
}


function renderTabs(activeStakes, followedPools) {
	activeStakes.forEach((activeStake) => {
		const tab = new Tab(activeStake.stake.address, activeStake.stake.id,activeStake.pool.ticker);
		tab.mainSubTab.addValue('delegation', activeStake.amount);
		tab.mainSubTab.addValue('rewards', activeStake.rewards);
		tab.mainSubTab.addLink(activeStake.pool.poolid);
		followedPools.forEach((pool)=> {
			const subTab = tab.add_sub_tab(pool.ticker, pool.id);
			subTab.addLink(pool.poolid) 
			subTab.addValue('potential', parseInt(activeStake.amount / pool.reward_ratio) )
		});
		tab.inject()
	});
}


async function postStakeAndRender(ticker_field) {
	await postStake(ticker_field)
	render()
}

async function postFollowedPoolsAndRender(ticker_field) {
	await postFollowedPool(ticker_field)
	render()
}

function getFollowedPools() {
	const token = AppStorage.session.token
	return fetch(`${AppStorage.BACKEND_URL()}/users/${AppStorage.session.user_id}/pools?epochno=${AppStorage.epoch.current}`,{
	    method:'GET',
	    headers: {
	 			"Authorization": `${token}`,
	      "Content-Type":"application/json",
	      "Accept": "application/json"
	    }
	  })
	  .then(resp=>resp.json())
	  .then(obj=> {
	  	console.log('getFollowedPools:')
	  	console.log(obj)
	  	return obj
	  })
}

function getActiveStakes() {
	const token = AppStorage.session.token
	return fetch(`${AppStorage.BACKEND_URL()}/users/${AppStorage.session.user_id}/active_stake?epochno=${AppStorage.epoch.current}`,{
	    method:'GET',
	    headers: {
	 			"Authorization": `${token}`,
	      "Content-Type":"application/json",
	      "Accept": "application/json"
	    }
	  })
	  .then(resp=>resp.json())
	  .then(obj=> {
	  	console.log('getActiveStakes:')
	  	console.log(obj)
	  	return obj
	  })
}


function postFollowedPool(value) {
	const ticker = value;
	const token = AppStorage.session.token;
	return fetch(`${AppStorage.BACKEND_URL()}/users/${AppStorage.session.user_id}/pools`,{
    method:'POST',
    headers: {
    	"Authorization": `${token}`,
      "Content-Type":"application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
    	ticker: ticker
    })
  }).then(resp=>resp.json())
  	.then(obj=> {
  		console.log(obj);
		})
}


function postStake(value) {
	const stake_addr = value;
	const token = AppStorage.session.token;
	return fetch(`${AppStorage.BACKEND_URL()}/users/${AppStorage.session.user_id}/stakes`,{
    method:'POST',
    headers: {
    	"Authorization": `${token}`,
      "Content-Type":"application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
    	stake: stake_addr
    })
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
	constructor(stakeAddr, stake_id, ticker) {
		super();
		this.stakeAddr = stakeAddr;
		this.stake_id = stake_id;
		this.tab = this.base_tab();
		this.mainSubTab = this.add_sub_tab(ticker, stake_id, 'stakes');
	};

	base_tab() {
  	const html_string = `
			<div class='tab' id='${this.stake_id}'>
				<div class='tab_title'>
					<a class='stake_link' href='https://cardanoscan.io/stakekey/${this.stakeAddr}' target='_blank'>
						${this.stakeAddr.slice(0, 23)}...
					</a>
				<div>
			</div>`;
		return super.buildHTML(html_string)
	};

	add_sub_tab(ticker, id, type) {
		const subTab = new SubTab(ticker, id, type);
		this.tab.appendChild(subTab.tab);
		return subTab
	};

	inject() {
		const tabs_target = document.getElementById('tabs_target')
		tabs_target.appendChild(this.tab)
	};
}



class SubTab extends String_to_html {
	constructor(ticker, id, type = 'pools') {
		super();
		this.id = id;
		this.type = type;
		this.ticker = ticker;
		this.tab = this.base_tab();
	}

	addLink(poolid) {
		const div = this.tab.getElementsByClassName('pool_ticker')[0];
		div.innerHTML = `<a href='https://cardanoscan.io/pool/${poolid}' target="_blank">${this.ticker}</a>`;
	}

	base_tab() {
  	const html_string =`
			<div class='sub_tab'>
				<form class='delete'>
					<input type="hidden" name='type' value='${this.type}'>
					<input type="hidden" name='id' value='${this.id}'>
					<button type="submit" class='x'>x</button>
				</form>
				<div class='tab_pool_values'>
			    <div class='pool_ticker'>${this.ticker}</div>
				</div> 
				<div class='tab_values'></div>
			</div>`;

		const subTab = super.buildHTML(html_string);
		const form = subTab.getElementsByClassName('delete')[0];
		form.addEventListener('submit', function(event) {
			event.preventDefault();
			fetch(`${AppStorage.BACKEND_URL()}/users/${AppStorage.session.user_id}/${this.type.value}/${this.id.value}`,{
				method:'DELETE',
				headers: {
					"Authorization":AppStorage.session.token,
		      "Content-Type":"application/json",
		      "Accept": "application/json"
		    }
			})
			.then(resp=>resp.json())
			.then((obj)=>{
				console.log(obj)
				render()
			});
		});

		return subTab
	};

	addValue(label, value) {
		const row = new ValueRow(label, value).build_row()
		const div = this.tab.getElementsByClassName('tab_values')[0]
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

	formatted_value() {
		if (this.symbol === '₳'){
			const value = this.value / 1000000;
			return numeral(parseInt(value)).format('0,0')
		} else { return this.value }
	}

	build_row() {
		const html_string = `
			<div class='row'>
		      <div class='tab_label'>${this.label}:</div>
		      <div class='tab_value'>${this.formatted_value()} ${this.symbol}</div>
		  </div>`
		return super.buildHTML(html_string) 
	};
}

function renderInstruction(){
	document.getElementById('tabs_target').innerHTML = `
	<div class='tab' id='instructions' style='padding:0px 20px 0px 0px'>
    <ol>
        <span class='instructions'>
        NO active <b>delegations</b> where detected.<br>
        Your stake address wasn't delegated or:
        </span>
        <br>
        <br>
        <li>
            <span class='instructions_title'>Submit a Username.</span>
            <br>
            <span class='instructions'>
            new or existing
            </span>
            <br>
            <br>
            <br>
        </li>
        <li><span class='instructions_title'>Enter one or more stake addresses.</span>
            <br>
            <span class='instructions'>Read this <a href='https://cardanoscan.io/'>instructions</a> if you don't know how to find your stake address.
                <br>
                <br>
                If you leave the Stake address field empty, a random stake will be assigned to you.
            </span>
            <br>
            <br>
            <br>
        </li>
        <li><span class='instructions_title'>Enter Pools to compare potential rewards.</span>
            <br>
            <span class='instructions'>
            The potential reward is calculated by finding the average rewards/delegation ratio for each pool multiplied by your stake address ₳ amount.
            <br>
                <br>
                If you leave the Pool field empty, a random Pool will be assigned to you.
            </span>
            <br>
            <br>
            <br>
        </li>
        <li><span class='instructions_title'>Shuffle through Epochs.</span>
        </li>
    </ol>
	</div>`
}
class String_to_html {
	buildHTML(html_string) {
		const parser = new DOMParser();
		const domString = html_string;
		var html = parser.parseFromString(domString, 'text/html');    
		return html.body.firstChild
	}
}

class SubTab extends String_to_html {
	constructor(ticker) {
		super();
		this.ticker = ticker;
		this.tab = this.base_tab(ticker);
	}

	base_tab(ticker) {
  	const html_string = `
			<div class='sub_tab'>
				<button class='x'></button>
				<div class='tab_pool_values'>
			    <div class='pool_ticker'>${ticker}</div>
				</div> 
				<div class='tab_values'></div>
			</div>`
		return super.buildHTML(html_string) 
	};

	inject() {
		tabs_target = document.getElementById('tabs_target')
		tabs_target.appendChild(this.tab)
	}

	// set real_delegation(){
	// }
};

class ValuesRow extends String_to_html {

}


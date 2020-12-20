class String_to_html {
	buildHTML(html_string) {
		const parser = new DOMParser();
		const domString = html_string;
		var html = parser.parseFromString(domString, 'text/html');    
		return html.body.firstChild
	}
}

class SubTab extends String_to_html {
	constructor() {
		super();
		this.tab = this.base_tab();
	}

	base_tab() {
  	const html_string = `
			<div class='sub_tab'>
				<button class='x'></button>
				<div class='tab_pool_values'>
			    <div class='pool_ticker'></div>
				</div> 
				<div class='tab_values'></div>
			</div>`
		return super.buildHTML(html_string) 
	};

	set ticker(ticker) {
		const div = this.tab.getElementById('pool_ticker')
		div.innerHTML = ticker
	}

	addValue(label, value) {
		const row = new ValueRow(label, value)
		const div = this.tab.getElementById('tab_values')
		div.appendChild(row)
	}

	inject() {
		const tabs_target = document.getElementById('tabs_target')
		tabs_target.appendChild(this.tab)
	};

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
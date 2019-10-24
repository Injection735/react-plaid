import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PlaidLink from 'react-plaid-link'

import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
const socket = openSocket('http://ec2-34-239-183-125.compute-1.amazonaws.com:5000');
var PLAID_PUBLIC = "";
var linkHandler = "";
var isConnected = false;

class App extends Component {
	handleOnSuccess(token, metadata) {
		console.log(metadata.account_id);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', '/plaid_connected', false);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onload = function(userJSON) {
			var json = JSON.parse(userJSON.currentTarget.responseText);
			ReactDOM.render(<SelfInfo name={json.name} balance={json.balance}></SelfInfo>, document.getElementById('your-balance'))
			var elem = document.querySelector("#card-parent");
			elem.remove();
			isConnected = true;
		};
		xhr.send(JSON.stringify({
			public_token: token,
			account_id: metadata.account_id
		}));

	}
	handleOnExit() {
		// handle the case when your user exits Link
	}
	render() {
		return (
			<div id="card-parent">
		    	    <div class="card">
		    		    <img class="pretty-img" src="data:image/png;base64,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">
		    		    </img>
				    <PlaidLink
    				clientName="Your app name"
    				env="sandbox"
    				product={["auth", "transactions"]}
    				publicKey='d7b8711f215eb7c2e5f439e8566ce0'
    				selectAccount={true}
    				onExit={this.handleOnExit}
    				onSuccess={this.handleOnSuccess}>
    				Connect to your bank!
    				</PlaidLink>
		    	    </div>
		        </div>

		)
	}
}

class SelfInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.name,
			balance: props.balance
		};
	}

	render() {
		return (
			<div>
				<div className="your-balance">{'your name: ' + this.state.name}</div>
				<div className="your-balance">{'your balance: ' + this.state.balance}</div>
			</div>
		)
	}
}

class User extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.name,
			balance: props.balance
		};
	}

	render() {
		return (
			<div className="user-row">
				<div className="user-name">{this.state.name}</div>
				<div className="user-balance">{this.state.balance}</div>
			</div>
		)
	}
}

export default App;

socket.on('connect', function() {
});

socket.on('updateTable', function(usersJSON) {
	if (!isConnected)
		return;

	for (var i = 0; i < usersJSON.length; i++) {
		var p = document.createElement("div");
		p.id = "p" + i;
		document.getElementById('users-table-elements').appendChild(p);
		ReactDOM.render(<User name={usersJSON[i].name} balance={usersJSON[i].balance}></User>, document.getElementById("p" + i))
	}
});

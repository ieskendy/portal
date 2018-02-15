import {topmost} from "ui/frame";
import {Http} from "../../services/http";
import {Page} from "ui/page";
import {LoadingIndicator} from "nativescript-loading-indicator";
import {Observable, EventData} from "data/observable";
import observableModule = require("data/observable");
import ObservableArray = require("data/observable-array");
import {Storage} from "../../services/storage";
let config = require("../../shared/config");

// Object
let page;
let loader = new LoadingIndicator();
const httpService = new Http;
const storageServices = new Storage;
let pageObservable = new Observable();
let errors = new ObservableArray.ObservableArray([]);

export function pageLoaded(args: EventData) {
	if(storageServices.get('student')) {
		topmost().navigate("tabs/tabs-page");
	}
	page = <Page>args.object;
	page.bindingContext = pageObservable;
}

// Login function
export function doLogin() {
	loader.show({
		message: 'Please wait....',
  		progress: 0.65,
  		android: {
  			indeterminate: true,
		    cancelable: true,
		    max: 100,
  		},
	});
	let credentials = {
		'username': pageObservable.get('username'),
		'password': pageObservable.get('password')
	};
	// Check if field is fill in
	if(!credentials.username){
		errors.push({
			"title": "Username is required!"
		});
			loader.hide();

	} 
	if (!credentials.password) {
		errors.push({
			"title": "Password is required!"
		});
		loader.hide();

	}
	if(credentials.password && credentials.username) {
		requestLogin(credentials);

	}
	showErrors();

}

function requestLogin(credentials: {'username': string, 'password': string}) {
	httpService.post({uri: '/login', data: credentials}, (response) => {
		if (! response.error) {
			storageServices.store('student', response.student);
			storageServices.store('user_token', {token: response.token});
			storageServices.store('username', {username: response.student.username});
			topmost().navigate("tabs/tabs-page");
			loader.hide();
		} else {
			loader.hide();
			alert('Invalid username or password!');	
		}
	}, (noConnection) => {
		loader.hide();
		alert('Unable to connect. Please check your internet connection!');
	});
}


function showErrors() {
	if(errors.length > 0) {
		pageObservable.set('errors', errors);
		setTimeout(()=> {
			while(errors.length) {
				errors.pop();
			}
			pageObservable.set('errors',null);
		}, 4000);
	}
}


import {topmost} from "ui/frame";
import {Validator} from "../../services/validator";
import {Http} from "../../services/http";
import {Page} from "ui/page";
import {Observable, EventData} from "data/observable";
import observableModule = require("data/observable");
import ObservableArray = require("data/observable-array");
import {Storage} from "../../services/storage";
import dialogs  = require("ui/dialogs");
import {LoadingIndicator} from "nativescript-loading-indicator";
let view = require("ui/core/view");

let page;
let loader = new LoadingIndicator();
let validatorService = new Validator;
let httpServie = new Http;
let pageObservable = new Observable();
let storageService = new Storage;
let errors = new ObservableArray.ObservableArray([]);
let studentData = storageService.get('student');
let username = storageService.get('username');

export function pageLoaded(args: EventData) {
	page = <Page>args.object;
	pageObservable.set('student', studentData);
	pageObservable.set('errors', false);
	page.bindingContext = pageObservable;
}

export function goBack() {
	topmost().goBack();
}


export function changeUsername()
{
	// Check if field is fill in
	let username = page.getViewById("username").text;
	let data = {
		username: username
	};

	if(!username){
		errors.push({
			"title": "Username field is required!"
		});
	}
	if(username) {
		loader.show({
			message: 'Please wait....',
	  		progress: 0.65,
	  		android: {
	  			indeterminate: true,
			    cancelable: true,
			    max: 100,
	  		},
		});
		requestChangeUsername(data);
	}
	
	showErrors();
}

function requestChangeUsername(data) {
	httpServie.post({uri: `/students/${studentData.student_id}/username` ,data: data}, (response) => {
		if (response.error) {
			errors.push({
				title: "Something went wrong while processing your request!"
			});
			showErrors();
			loader.hide();
		} else {
			storageService.update('username', {username: data.username});
			alert('Your username is successfully updated');
			loader.hide();	
		}
	}, () => {
		alert('Unable to connect. Please check your internet connection!');
        loader.hide();
        topmost().navigate("tabs/tabs-page ");
	});
}

function showErrors() {
	let listview = view.getViewById(page, "errors");
	if(errors.length > 0) {
		pageObservable.set('errors',errors);
		listview.items = errors;
		setTimeout(()=> {
			while(errors.length) {
				errors.pop();
			}
			pageObservable.set('errors', null);
		}, 4000);
	}
}
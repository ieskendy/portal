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

export function pageLoaded(args: EventData) {
	page = <Page>args.object;
	pageObservable.set('errors', false);
	page.bindingContext = pageObservable;
}

export function goBack() {
	topmost().goBack();
}


export function changePassword()
{
	loader.show({
		message: 'Please wait....',
  		progress: 0.65,
  		android: {
  			indeterminate: true,
		    cancelable: true,
		    max: 100,
  		},
	});
	let data = {
		newpassword: pageObservable.get('newpassword'),
		oldpassword: pageObservable.get('oldpassword')
	};

	if(!data.oldpassword){
		errors.push({
			"title": "Old password field is required!"
		});
	}
	
	if(!data.newpassword){
		errors.push({
			"title": "New password field is required!"
		});
	}

	if(!validatorService.len(data.newpassword, 7, 30)) {
		errors.push({
			"title": "Your password must be at least 7 characters long. Please try again!"
		});
	}


	if(data.newpassword && data.oldpassword && validatorService.len(data.newpassword, 7, 30)) {
		loader.show();
		requestChangePassword(data);
	}
	showErrors();
	loader.hide();
}

function requestChangePassword(data) {
	httpServie.post({uri: `/students/${studentData.student_id}/password`, data: data}, (response) => {
		if (response.error) {
			loader.hide();
			alert('Invalid old password');
		} else {
			loader.hide();
			alert('You`re password is successfully updated');
		}
	}, (noConnection) => {
		alert('Unable to connect. Please check your internet connection!');
        loader.hide();
        topmost().navigate("tabs/tabs-page");
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
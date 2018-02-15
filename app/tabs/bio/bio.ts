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
	console.log('loaded');
	pageObservable.set('student', studentData);
	pageObservable.set('errors', false);
	page.bindingContext = pageObservable;
}

export function goBack() {
	topmost().goBack();
}

export function updateStudentInformation()
{
	let data = {
		contact_number: page.getViewById("contact_number").text,
		place_birth: page.getViewById("place_birth").text,
		email: page.getViewById("email").text,
		address: page.getViewById("address").text
	};
	if (!validatorService.validateEmail(data.email)) {
		errors.push({
			'title': "Invalid email address"
		});
		loader.hide();
	}
	if (!validatorService.isNumber(data.contact_number)) {
		errors.push({
			'title': "Contact number must digit"
		});
		loader.hide();
	}
	if(!validatorService.len(data.contact_number, 11, 20)) {
		errors.push({
			'title': "Contact number must range from 11 to 20"
		});
		loader.hide();
	}

	if(!data.address) {
		errors.push({
			'title': "Address field is required"
		});
		loader.hide();
	}

	if(!data.contact_number) {
		errors.push({
			'title': "Contact number field is required"
		});
		loader.hide();
	}

	if(!data.email) {
		errors.push({
			'title': "Email field is required"
		});
		loader.hide();
	}

	if(!data.place_birth) {
		errors.push({
			'title': "Place birth field is required"
		});
		loader.hide();
	}
	
	if (data.email && 
		data.contact_number && 
		data.address && 
		data.place_birth &&
		validatorService.validateEmail(data.email) &&
		validatorService.isNumber(data.contact_number) &&
		validatorService.len(data.contact_number, 11, 20)
		) {
		loader.show({
			message: 'Please wait....',
	  		progress: 0.65,
	  		android: {
	  			indeterminate: true,
			    cancelable: true,
			    max: 100,
	  		},
		});
		console.log('Changing Personal Info');
		requestUpdateStudentInformation(data);
	}
	showErrors();
}


function requestUpdateStudentInformation(data) {
	console.log('Updating Student Information');
	httpServie.post({uri: `/students/${studentData.student_id}`, data: data}, (response) => {
		if (response.error) {
			loader.hide();
			errors.push({
				title: "Something went wrong while processing your request!"
			});
			showErrors();
		} else {
			loader.hide();
			alert('Successfully updated');
			storageService.update('student', response);
		}
	}, () => {
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
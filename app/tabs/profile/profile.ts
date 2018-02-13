import {topmost} from "ui/frame";
import {Http} from "../../services/http";
import {Page} from "ui/page";
import {Observable, EventData} from "data/observable";
import observableModule = require("data/observable");
import ObservableArray = require("data/observable-array");
import {Storage} from "../../services/storage";
import dialogs  = require("ui/dialogs");
import {LoadingIndicator} from "nativescript-loading-indicator";
import { SelectedIndexChangedEventData } from "nativescript-drop-down";
import { ValueList } from "nativescript-drop-down";
let config = require("../../shared/config");
let view = require("ui/core/view");

let drawer;
let page;

let loader = new LoadingIndicator();
let pageObservable = new Observable();
let httpService = new Http;
let storageService = new Storage;
let documentList = new ValueList;
let requestedDocumentsList = new ObservableArray.ObservableArray([]);
let errors = new ObservableArray.ObservableArray([]);
let studentData = storageService.get('student');

export function onLoaded(args: EventData) {
	  page = <Page>args.object;
    pageObservable.set('student', studentData);
    console.log(JSON.stringify(studentData));
    page.bindingContext = pageObservable;
}

export function grades() {
  console.log('Grades Tap');
  topmost().navigate("tabs/grades/grades");
}

export function schedule() {
  console.log('Schedule Tap');
  topmost().navigate("tabs/schedule/schedule");
}

export function document() {
  	fetchStudentRequest();
}

export function fees() {
  console.log('Fee Tap');
  topmost().navigate("tabs/misc/misc");
}

function fetchStudentRequest() {
    httpService.get({uri: `/students/${studentData.student_id}/documents`}, (response) => {
        console.log(JSON.stringify(response));
        if (response.error) {
          	topmost().navigate("tabs/request-form/request-form");
        } else {
           	topmost().navigate("tabs/request/request");
        }
    }, () => {
        alert('Unable to connect. Please check your internet connection!');
    });
}
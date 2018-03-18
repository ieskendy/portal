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

//SideDrawer
exports.pageLoaded = function(args: EventData) {
    page = <Page>args.object;
    loader.show({
        message: 'Please wait....',
          progress: 0.65,
          android: {
              indeterminate: true,
            cancelable: true,
            max: 100,
          },
    });
    pageObservable.set('student', studentData);
    fetchStudentRequest();
    page.bindingContext = pageObservable;
};

export function goBack() {
    topmost().navigate("tabs/tabs-page");
}

export function showForm() {
    topmost().navigate("tabs/request-form/request-form");
}



function fetchStudentRequest() {
    httpService.get({uri: `/students/${studentData.student_id}/documents`}, (response) => {
        if (response.error) {
            alert('You dont have request');
        } else {
            let requestedDocuments = response;
            if(requestedDocumentsList.length == 0) {
                loadRequestedDocument(requestedDocuments);
                loader.hide();
            } else {
                while(requestedDocumentsList.length) {
                   requestedDocumentsList.pop();
               }
               loadRequestedDocument(requestedDocuments);
               loader.hide();
            }   
        }
    }, (noConnection) => {
        alert('Unable to connect. Please check your internet connection!');
        loader.hide();
        topmost().navigate("tabs/tabs-page");
    });
}

function loadRequestedDocument(requestedDocuments) {
    requestedDocuments.data.forEach( (request) => {
        requestedDocumentsList.push({
            'id': request.request_id,
            'document': request.document_type,
            'requested_at': request.requested_at,
            'status': request.status
        });
    });

    let listview = view.getViewById(page, "requestedDocuments");
    listview.items = requestedDocumentsList;
}

function showErrors() {
    if(errors.length > 0) {
        pageObservable.set('errors', errors);
        let listview = view.getViewById(page, "errors");
        listview.items = errors;
        setTimeout(()=> {
            while(errors.length) {
                errors.pop();
            }
            pageObservable.set('errors',null);
        }, 4000);
    }
}

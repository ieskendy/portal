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
let isEditing = false;
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
    requestDocuments();
    pageObservable.set('purpose', '');
    page.bindingContext = pageObservable;
};

export function goBack() {
    topmost().goBack();
}


export function submitRequest() {
    loader.show({
        message: 'Please wait....',
          progress: 0.65,
          android: {
              indeterminate: true,
            cancelable: true,
            max: 100,
          },
    });
    let selectedItem = pageObservable.get('selectedIndex');
    let selectedValue = documentList.getValue(selectedItem);
    let data = {
        'purpose': pageObservable.get('purpose'),
        'student_id': studentData.student_id,
        'document_id': selectedValue
    };
    
    if(!data.document_id) {
        errors.push({
            "title": "Document type field is required!"
        });
        loader.hide();
    }
    if(!data.purpose) {
        errors.push({
            "title": "Purpose field is required"
        });
        loader.hide();
    }

    if(data.document_id && data.purpose) {
        saveNewRequest(data);
    }

    showErrors();
}

function requestDocuments() {
    httpService.get({uri: `/documents`}, (response) => {
        console.log(JSON.stringify(response));
        if (response.error) {
            alert('Something went wrong! Please check your internet connection');
            loader.hide();
            topmost().navigate("tabs/tab-view");
        } else {
            let documents = response;
            if (documentList.length == 0) {
                loadDocuments(documents);
                loader.hide();
            } else {
                while(documentList.length) {
                    documentList.pop();
                }
                loadDocuments(documents);
                loader.hide();
            }
        }
    }, (noConnection) => {
        alert('Unable to connect. Please check your internet connection!');
        loader.hide();
        topmost().navigate("tabs/tab-view");
    });
}

function saveNewRequest(data: any) {
    httpService.post({uri: "/documents", data: data }, (response) => {
        if (response.error) {
            alert('Internal error. Please try again');
            loader.hide();
        } else {
            dialogs.alert({
                title: "Information",
                message: "Your request is successfully submitted!",
                okButtonText: "OK"
            }).then(() => {
                topmost().navigate("tabs/request/request");
                loader.hide();
            });
        }
    }, (noConnection) => {
        alert('Unable to connect. Please check your internet connection!');
        loader.hide();
        topmost().navigate("tabs/tabs-page");
    });
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

function loadDocuments(documents: any) {
    documents.data.forEach((document) => {
        documentList.push({
            value: document.id,
            display: document.document_title
        });
    });
    pageObservable.set('selectedIndex', 0);
    pageObservable.set('documents', documentList);
    loader.hide();
}
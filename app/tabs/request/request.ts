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
    // loader.show({
    //     message: 'Please wait....',
    //       progress: 0.65,
    //       android: {
    //           indeterminate: true,
    //         cancelable: true,
    //         max: 100,
    //       },
    // });
    // fetchStudentRequest();
    // pageObservable.set('student', studentData);
    // drawer = view.getViewById(page, "sideDrawer");
    pageObservable.set('isEditing', isEditing);
    page.bindingContext = pageObservable;
};

export function goBack() {
    topmost().goBack();
}

// exports.editProfile = function() {
//     topmost().navigate("views/profile/profile");
// }

// export function logout() {
//     storageService.destroy('student');
//     topmost().navigate("views/login/login");
// }

export function showForm() {
    // requestDocuments();
    pageObservable.set('isEditing', true);
}

// export function submitRequest() {
//     loader.show({
//         message: 'Please wait....',
//           progress: 0.65,
//           android: {
//               indeterminate: true,
//             cancelable: true,
//             max: 100,
//           },
//     });
//     let selectedItem = pageObservable.get('selectedIndex');
//     let selectedValue = documentList.getValue(selectedItem);
//     let data = {
//         'purpose': pageObservable.get('purpose'),
//         'student_id': studentData.student_id,
//         'document_id': selectedValue
//     };
//     console.log(JSON.stringify(data));
//     if(!data.document_id) {
//         errors.push({
//             "title": "Document type field is required!"
//         });
//         loader.hide();
//     }
//     if(!data.purpose) {
//         errors.push({
//             "title": "Purpose field is required"
//         });
//         loader.hide();
//     }

//     if(data.document_id && data.purpose) {
//         saveNewRequest(data);
//     }

//     showErrors();
// }

// function requestDocuments() {
//     httpService.get({uri: `/documents`}, (response) => {
//         console.log(JSON.stringify(response));
//         if (response.error) {
//             alert('Something went wrong! Please check your internet connection');
//             loader.hide();
//             topmost().navigate("views/home/home");
//         } else {
//             let documents = response;
//             if (documentList.length == 0) {
//                 loadDocuments(documents);
//                 loader.hide();
//             } else {
//                 while(documentList.length) {
//                     documentList.pop();
//                 }
//                 loadDocuments(documents);
//                 loader.hide();
//             }
//         }
//     }, () => {
//         alert('Unable to connect. Please check your internet connection!');
//         loader.hide();
//         topmost().navigate("views/home/home");
//     });
// }

// function saveNewRequest(data: any) {
//     httpService.post({uri: "/documents", data: data }, (response) => {
//         if (response.error) {
//             alert('Internal error. Please try again');
//         } else {
//             dialogs.alert({
//                 title: "Information",
//                 message: "Your request is successfully submitted!",
//                 okButtonText: "OK"
//             }).then(() => {
//                 fetchStudentRequest();
//                 pageObservable.set('purpose', null);
//                 pageObservable.set('isEditing', false);
//             });
//         }
//     }, () => {
//         alert('Unable to connect. Please check your internet connection!');
//         loader.hide();
//         topmost().navigate("views/home/home");
//     });
// }

// function fetchStudentRequest() {
//     httpService.get({uri: `/students/${studentData.student_id}/documents`}, (response) => {
//         if (response.error) {
//             alert('You dont have request');
//         } else {
//             let requestedDocuments = response;
//             if(requestedDocumentsList.length == 0) {
//                 loadRequestedDocument(requestedDocuments);
//                 loader.hide();
//             } else {
//                 while(requestedDocumentsList.length) {
//                    requestedDocumentsList.pop();
//                }
//                loadRequestedDocument(requestedDocuments);
//                loader.hide();
//             }   
//         }
//     }, () => {
//         alert('Unable to connect. Please check your internet connection!');
//         loader.hide();
//         topmost().navigate("views/home/home");
//     });
// }

// function loadRequestedDocument(requestedDocuments) {
//     requestedDocuments.data.forEach( (request) => {
//         requestedDocumentsList.push({
//             'id': request.request_id,
//             'document': request.document_type,
//             'requested_at': request.requested_at,
//             'released_at': request.released_at
//         });
//     });

//     let listview = view.getViewById(page, "requestedDocuments");
//     listview.items = requestedDocumentsList;
// }

// function showErrors() {
//     if(errors.length > 0) {
//         pageObservable.set('errors', errors);
//         let listview = view.getViewById(page, "errors");
//         listview.items = errors;
//         setTimeout(()=> {
//             while(errors.length) {
//                 errors.pop();
//             }
//             pageObservable.set('errors',null);
//         }, 4000);
//     }
// }

// function loadDocuments(documents: any) {
//     documents.data.forEach((document) => {
//         documentList.push({
//             value: document.id,
//             display: document.document_title
//         });
//     });
//     pageObservable.set('selectedIndex', 0);
//     pageObservable.set('documents', documentList);
//     loader.hide();
// }
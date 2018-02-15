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

const httpService = new Http;
const storageService = new Storage;
let paymentList = new ObservableArray.ObservableArray([]);
let studentData = storageService.get('student');
let academic_year = true;
let academicYearList =  new ValueList;
let loader = new LoadingIndicator();
let pageObservable = new Observable();
let errors = new ObservableArray.ObservableArray([]);
//SideDrawer
export function pageLoaded(args: EventData) {
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
    requestAcademicYears();
    pageObservable.set('academic_year', academic_year);
    page.bindingContext = pageObservable;
};


export function submitAcademicYear(args: SelectedIndexChangedEventData) {
    // Get selected item
    let selectedItem = pageObservable.get('selectedIndex');
    let selectedValue = academicYearList.getValue(selectedItem);
    loader.show({
        message: 'Please wait....',
        progress: 0.65,
        android: {
            indeterminate: true,
            cancelable: true,
            max: 100,
        },
    });
    let semester = academicYearList.getItem(selectedItem);
    if (!semester && !selectedValue) {
        alert('Please fill up the form properly');
    }
    
    if (semester && selectedValue) {
        pageObservable.set('semester', semester.display);
        requestStudentPayments(selectedValue);
    }
}

export function onChange() {
  console.log('Changing');
  pageObservable.set('academic_year', true);
}

function requestAcademicYears() {
    httpService.get({uri: `/students/${studentData.student_id}/semesters`}, (response) => {
        if (response.error) {
            alert('Something went wrong! Please try again or check your connection');
            topmost().navigate("views/home/home");
            loader.hide();
        } else {
            let semesters = response;
            if (academicYearList.length == 0) {
                loadAcademicYears(semesters);
            } else {
                // while (academicYearList.length) {
                //     academicYearList.pop();
                //     loadAcademicYears(semesters);
                // }
                pageObservable.set('items', academicYearList);
                loader.hide();
            }
        }
    }, () => {
        alert('Unable to connect. Please check your internet connection!');
        loader.hide();
        topmost().navigate("views/home/home");
    });
}


function loadAcademicYears(academic_years: any) {
    academic_years.data.forEach((year) => {
        academicYearList.push({
            value: year.id,
            display: year.academic_year
        });
    });
    pageObservable.set('selectedIndex', 0);
    pageObservable.set('items', academicYearList);
    loader.hide();
}

function requestStudentPayments (academic_year: any) {
    httpService.get({uri: `/students/${studentData.student_id}/semesters/${academic_year}/payments`},
    (response) => {
        if (response.error) {
            alert('404: Misc fee information not found');
            pageObservable.set('academic_year', true);
            loader.hide();
        } else {
            pageObservable.set('academic_year', false);
            let payments = response;
            if(paymentList.length == 0) {
               loadPayments(payments);
            } else {
                while(paymentList.length) {
                   paymentList.pop();
                }
               loadPayments(payments);
           }
        }
    }, () => {
        alert('Unable to connect. Please check your internet connection!');
        loader.hide();
        topmost().navigate("views/home/home");
    });
}

function loadPayments(payments) {
    payments.data.forEach((payment) => {
        paymentList.push({
            particular: payment.particulars,
            amount: payment.amount,
            amount_paid: payment.amount_paid,
            balance: payment.balance
        });
    });
    getTotalAmountPaid(payments);
    var listview = view.getViewById(page, "payments");
    listview.items = paymentList;
    loader.hide();
}

function getTotalAmountPaid(payments) {
	let total = 0;
	payments.data.forEach((payment) => {
        total += payment.amount_paid;
    });

    pageObservable.set('total', total);
}

export function goBack() {
    topmost().goBack();
}

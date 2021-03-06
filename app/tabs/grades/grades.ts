import {topmost} from "ui/frame";
import {Http} from "../../services/http";
import {Page} from "ui/page";
import {Observable, EventData} from "data/observable";
import observableModule = require("data/observable");
import ObservableArray = require("data/observable-array");
import {Storage} from "../../services/storage";
import dialogs  = require("ui/dialogs");
import {LoadingIndicator} from "nativescript-loading-indicator";
import { SelectedIndexChangedEventData, ValueList } from "nativescript-drop-down";
let view = require("ui/core/view");

let drawer;
let page;
let pageObservable = new Observable();
let storageService = new Storage;
let httpService = new Http;
let gradesList = new ObservableArray.ObservableArray([]);
let loader = new LoadingIndicator();
let academicYearList =  new ValueList;
let studentData = storageService.get('student');
let academic_year = true;
let errors = new ObservableArray.ObservableArray([]);

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
    pageObservable.set('student', studentData);
    page.bindingContext = pageObservable;
};

export function onChange () {
	pageObservable.set('academic_year', true);
}

export function goBack() {
	topmost().goBack();
	
	// topmost().navigate('tabs/tabs-page');
}

export function submitAcademicYear(args: SelectedIndexChangedEventData) {
    // Get selected item
    let selectedItem = pageObservable.get('selectedIndex');
    let selectedValue = academicYearList.getValue(selectedItem);
    let semester = academicYearList.getItem(selectedItem);
    
    loader.show({
		message: 'Please wait....',
  		progress: 0.65,
  		android: {
  			indeterminate: true,
		    cancelable: true,
		    max: 100,
  		},
	});
	if (!semester && !selectedValue) {
        alert('Please fill up the form properly');
    }
    
    if (semester && selectedValue) {
        pageObservable.set('semester', semester.display);
        requestGrades(selectedValue);
    }
    
}

function requestGrades(academic_year) {
	httpService.get({uri: `/students/${studentData.student_id}/semesters/${academic_year}/grades`},
	(response) => {
		if (!response.error) {
			let grades = response;
			if(gradesList.length == 0) {
   				loadGrades(grades);
   				computeGeneralAverage(grades);
   				pageObservable.set('academic_year', false);
   			} else {
				while(gradesList.length) {
					gradesList.pop();
				}
				loadGrades(grades);
				pageObservable.set('academic_year', false);
   			}
		} else {
			alert('Grades not found');
            loader.hide();
		}
	}, () => {
		loader.hide();
		alert('Unable to connect. Please check your connection');
		topmost().navigate('tabs/tabs-page');
	});
}

function loadGrades(grades: any) {
	grades.data.forEach((grade) => {
		gradesList.push({
			subjectCode: grade.course_code,
			subjectTitle: grade.course_title,
			midterm: grade.midterm_grade,
			finals: grade.final_grade
		});
	});
	let listview = view.getViewById(page, "grades");
    listview.items = gradesList;
    loader.hide();
}


function requestAcademicYears() {
	httpService.get({uri: `/students/${studentData.student_id}/semesters`}, (response) => {
		if (!response.error) {
			let academic_years = response;
			if(academicYearList.length == 0) {
				loadAcademicYears(academic_years);
			} else {
				pageObservable.set('items', academicYearList);
				loader.hide();
			}
		} else {
			dialogs.alert('Sorry! Please try again');
 			loader.hide();
			topmost().navigate('tabs/tabs-page');
		}
	}, (noConnection) => {
		loader.hide();
		alert('Unable to connect. Please check your connection');
		topmost().navigate('tabs/tabs-page');
	});
}

function loadAcademicYears(academic_years: any) {
	academic_years.data.forEach((year) => {
		academicYearList.push({
			value: year.id,
			display: year.academic_year
		});
	});
    pageObservable.set('items', academicYearList);
    pageObservable.set('selectedIndex', 0);
    loader.hide();
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



function computeGeneralAverage(grades) {
	let average = 0;
	let generalaverage = 0;
	grades.data.forEach((grade) => {
		average += (parseFloat(grade.final_grade) * parseFloat(grade.midterm_grade) / 2)
	});

	generalaverage = average / gradesList.length;
	pageObservable.set('generalAverage', generalaverage);
}
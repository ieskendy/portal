import {topmost} from "ui/frame";
import * as utils from "utils/utils";
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
let httpService = new Http;
let storageService = new Storage();
let loader = new LoadingIndicator();
let pageObservable = new Observable();
let scheduleList = new ObservableArray.ObservableArray([]);
let sectionList = new ValueList;
let days = new ValueList;
let schedule_form = true;
let studentData = storageService.get('student');
let errors = new ObservableArray.ObservableArray([]);


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
    pageObservable.set('schedule_form', schedule_form);
    loadDays();
    requestSections();
    page.bindingContext = pageObservable;
};


export function viewSchedule() {
	let selectedday = pageObservable.get('selectedDay');
	let selectedsection = pageObservable.get('selectedSection');
    loader.show({
        message: 'Please wait....',
          progress: 0.65,
          android: {
              indeterminate: true,
            cancelable: true,
            max: 100,
          },
    });
	let day = days.getValue(selectedday);
	let section = sectionList.getValue(selectedsection);
    pageObservable.set('section', section);
    if (!day && !section) {
        alert('Please fill up the form properly');
    } else {
        requestSchedules(section, day);
        pageObservable.set('schedule_form',false);
    }
        
}

export function onSave() {
    let section = pageObservable.get('section');
    console.log(section);
    utils.openUrl(`${config.apiUrl}/schedules/${section}/download`);
}

export function onChange() {
  console.log('back');
  pageObservable.set('schedule_form', true);
}

function loadDays() {
	if(days.length == 0) {
		days.push(
			{
	        	value: "monday",
	        	display: "Monday"
	    	},
	    	{
	    		value: "tuesday",
	    		display: "Tuesday"
	    	},
	    	{
	    		value: "wednesday",
	    		display: "Wednesday"
	    	},
	    	{
	    		value: "thrusday",
	    		display: "Thrusday"
	    	},
	    	{
	    		value: "friday",
	    		display: "Friday"
	    	},
	    	{
	    		value: "saturday",
	    		display: "Saturday"
	    	},
	    	{
	    		value: "sunday",
	    		display: "Sunday"
	    	},
	    );
	    pageObservable.set('days', days);
	    pageObservable.set('selectedDay', 0);
	}
    pageObservable.set('days',days);
}

function requestSections() {
    httpService.get({uri: `/sections/programs/${studentData.program_id}`}, (response) => {
        if (response.error) {
            alert('Something went wrong! Please try again');
            topmost().navigate('tabs/tabs-page');
        } else {
            let sections = response;
            if(sectionList.length == 0) {
                loadSections(sections);
                loader.hide();
            } else {
                while(sectionList.length) {
                   sectionList.pop();
               }
               loadSections(sections);
               loader.hide();
            }
        }
    }, (noConnection) => {
        alert('Unable to connect. Please check your internet connection!');
        loader.hide();
        topmost().navigate("tabs/tabs-page");
    });
}

function loadSections(sections) {
	sections.data.forEach((section) => {
        sectionList.push({
            value: section.section_id,
            display: section.section_title
        });
    });
    pageObservable.set('selectedSection', 0);
    pageObservable.set('sections', sectionList);
    loader.hide();
}

function requestSchedules(section: any, day: any) {
    httpService.get({uri: `/schedules/sections/${section}/days/${day}`}, (response) => {
        if (response.error) {
            loader.hide();
            alert('You dont have class in this day! Nice');
            pageObservable.set('schedule_form',true);
        } else {
            pageObservable.set('schedule_form', false);
            let schedules = response;
            if(scheduleList.length == 0) {
                loadSchedules(schedules);
                pageObservable.set('day',day);
            } else {
                while(scheduleList.length) {
                   scheduleList.pop();
                }
                loadSchedules(schedules);
                loader.hide();
                pageObservable.set('day',day);
            }
        }
    }, (noConnection) => {
        alert('Unable to connect. Please check your internet connection!');
        loader.hide();
        topmost().navigate("tabs/tabs-page");
    });
}


function loadSchedules(schedules) {
    schedules.data.forEach((schedule) => {
        scheduleList.push({
            time_start: schedule.time_start,
            time_end: schedule.time_end,
            course_code: schedule.course_code,
            course_title: schedule.course_title,
            instructor: schedule.instructor,
            room: schedule.room
        });
    });
    let listview = view.getViewById(page, "schedules");
    listview.items = scheduleList;
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

export function goBack() {
	topmost().goBack();
}


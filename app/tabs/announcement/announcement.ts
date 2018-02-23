import {topmost} from "ui/frame";
import {Http} from "../../services/http";
import {Page} from "ui/page";
import {Observable, EventData} from "data/observable";
import observableModule = require("data/observable");
import ObservableArray = require("data/observable-array");
import {Storage} from "../../services/storage";
import {LoadingIndicator} from "nativescript-loading-indicator";
import dialogs  = require("ui/dialogs");

let config = require("../../shared/config");
let view = require("ui/core/view");


let drawer;
let page;
let httpService = new Http;
let loader = new LoadingIndicator();
let pageObservable = new Observable();
let storageService = new Storage;
let announcementList = new ObservableArray.ObservableArray([]);

export function onLoaded(args: EventData) {
    page = <Page>args.object;

    if (announcementList.length > 0) {
      let listview = view.getViewById(page, "announcements");
      listview.items = announcementList;
    } else {
      loader.show({
      message: 'Please wait....',
        progress: 0.65,
        android: {
          indeterminate: true,
          cancelable: true,
          max: 100,
        },
      });
      requestAnnouncements();
    }
    page.bindingContext = pageObservable;
}

export function showAnnouncement(args) {
    console.log('view announcement');
  	let announcement = args.view.bindingContext;
  	topmost().navigate({
  		moduleName: "tabs/viewAnnouncement/viewAnnouncement",
  		context: announcement
  	});
}

function requestAnnouncements() {
  httpService.get({uri: '/announcements'}, (response) => {
    if (! response.error) {
      let annoucenments = response;
      if (announcementList.length == 0) {
        loadAnnouncement(annoucenments);
      } else {
        while(announcementList.length) {
          announcementList.pop();
        }
        loadAnnouncement(annoucenments);
      }
    } else {
      alert('No posted announcements');
    }
  }, (noConnection) => {
    loader.hide();
    alert('Unable to connect. Please check your connection');
    topmost().navigate('tabs/announcement/announcement');
  });
}

function loadAnnouncement(announcements) {
  announcements.data.forEach( (announcement) => {
    announcementList.push({
      date: announcement.starts_date,
      month: announcement.start_month,
      day: announcement.start_day,
      year: announcement.start_year,
      title: announcement.title,
      ends_at: announcement.ends_at,
      color: announcement.color.replace(/['"]+/g, ''),
      description: announcement.description,
      posted_by: announcement.posted_by
    });
  });
  let listview = view.getViewById(page, "announcements");
    listview.items = announcementList;
    loader.hide();
}
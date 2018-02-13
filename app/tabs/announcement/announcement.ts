import {Observable, EventData} from "data/observable";
import {topmost} from "ui/frame";
import ObservableArray = require("data/observable-array");
import {Page} from "ui/page";
let view = require("ui/core/view");

let page;
let pageObservable = new Observable();

export function pageLoaded(args: EventData) {
    page = <Page>args.object;
    let announcement = page.navigationContext;
    console.log(JSON.stringify(announcement));
    showAnnouncement(announcement);
    page.bindingContext = pageObservable;
}

function showAnnouncement(announcement: any) {
    pageObservable.set('announcement', announcement);
}

export function redirectBack() {
  console.log('going back...');
  topmost().goBack();
}
import {Observable, EventData} from "data/observable";
import {topmost} from "ui/frame";
import ObservableArray = require("data/observable-array");
import {Page} from "ui/page";
let view = require("ui/core/view");

let page;
let pageObservable = new Observable();

export function onLoaded(args: EventData) {
    page = <Page>args.object;
    page.bindingContext = pageObservable;
}

export function redirectBack() {
  console.log('going back...');
  topmost().goBack();
}
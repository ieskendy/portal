import {topmost} from "ui/frame";
import { EventData, Observable } from "data/observable";
import {Page} from "ui/page";

let pageObservable = new Observable;
let page;

export function pageLoaded(args: EventData) {
	page = <Page>args.object;
	console.log('loaded');
	pageObservable.set('errors', false);
	page.bindingContext = pageObservable;
}

export function goBack() {
	topmost().goBack();
}

export function updateStudentInformation() {
	console.log('update button tap');
	pageObservable.set('errors', true);
}
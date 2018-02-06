import {topmost} from "ui/frame";
import {Observable, EventData} from "data/observable";
import ObservableArray = require("data/observable-array");
import {Page} from "ui/page";
let view = require("ui/core/view");

let page;
let pageObservable = new Observable();
let announcementList = new ObservableArray.ObservableArray([]);

export function onLoaded(args: EventData) {
    page = <Page>args.object;
    loadAnnoucements();
    page.bindingContext = pageObservable;
}

function loadAnnoucements() {
  announcementList.push(
    {
      date: 'Nov. 25 1997',
      title: 'Pictorial asdashdkasj hkasdkjasdk akjsdhaksd jasdhk',
      color: 'Tomato',
      posted_by: 'Sir. Mongol Kahn'
    },
    {
      date: 'Nov. 25 1997',
      title: 'Pictorial',
      color: 'Tomato',
      posted_by: 'Sir. Mongol Kahn'
    },
    {
      date: 'Nov. 25 1997',
      title: 'Pictorial',
      color: 'Tomato',
      posted_by: 'Sir. Mongol Kahn'
    },
    {
      date: 'Nov. 25 1997',
      title: 'Pictorial',
      color: 'Tomato',
      posted_by: 'Sir. Mongol Kahn'
    },
  );
  let listview = view.getViewById(page, "announcements");
  listview.items = announcementList;
}

export function showAnnouncement(args) {
    console.log('view announcement');
  	let announcement = args.view.bindingContext;
  	topmost().navigate({
  		moduleName: "tabs/announcement/announcement",
  		context: announcement
  	});
}

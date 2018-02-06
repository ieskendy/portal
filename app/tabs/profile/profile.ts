import {topmost} from "ui/frame";
import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
}

export function grades() {
  console.log('Grades Tap');
  topmost().navigate("tabs/grades/grades");
}

export function schedule() {
  console.log('Schedule Tap');
  topmost().navigate("tabs/schedule/schedule");
}

export function document() {
  console.log('Document Tap');
  topmost().navigate("tabs/request/request");
}

export function fees() {
  console.log('Fee Tap');
  topmost().navigate("tabs/misc/misc");
}

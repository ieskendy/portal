import {topmost} from "ui/frame";
import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";
import {Storage} from "../../services/storage";

let storageService = new Storage;

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
}

export function isChangePersonalInformation() {
  console.log('Changing Personal Information');
  topmost().navigate("tabs/bio/bio");
}

export function isChangePassword() {
  console.log('Changing Password');
  topmost().navigate("tabs/password/password");
}

export function isChangeUsername() {
  console.log('Changing Username');
  topmost().navigate("tabs/username/username");
}

export function doLogout() {
  	console.log('Signing out');
  	storageService.flush();
	  topmost().navigate({moduleName: "tabs/login/login", clearHistory: true});
}

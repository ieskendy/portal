import { EventData } from "data/observable";
import { StackLayout } from "ui/layouts/stack-layout";

export function onLoaded(args: EventData) {
    const component = <StackLayout>args.object;
}


export function isChangePersonalInformation() {
  console.log('Changing Personal Information');
}

export function isChangePassword() {
  console.log('Changing Password');
}

export function isChangeUsername() {
  console.log('Changing Username');
}

export function doLogout() {
  console.log('Signing out');
}

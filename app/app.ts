import * as application from 'application';
import platform = require('platform');
import {Storage} from "./services/storage";
import {Session} from "./services/session";
import connectivity = require('connectivity');
import {topmost} from "ui/frame";
const storageService = new Storage;


application.on(application.launchEvent, (args: application.ApplicationEventData) => {
    if (args.android) {
        console.log("Launched Android application with the following intent: " + args.android + ".");
    } else if (args.ios !== undefined) {
        console.log("Launched iOS application with options: " + args.ios);
    }
});

application.on(application.suspendEvent, (args: application.ApplicationEventData) => {
    if (args.android) {
        console.log("Activity: " + args.android);
    } else if (args.ios) {
        console.log("UIApplication: " + args.ios);
    }
});

application.on(application.resumeEvent, (args: application.ApplicationEventData) => {
    if (args.android) {
        console.log("Activity: " + args.android);
        let student = storageService.get('student');
        if (!student) {
            topmost().navigate({ moduleName: 'tabs/login/login', clearHistory: true });
        }
    } else if (args.ios) {
        console.log("UIApplication: " + args.ios);
    }
});

application.on(application.exitEvent, (args: application.ApplicationEventData) => {
    if (args.android) {
        console.log("Activity: " + args.android);
    } else if (args.ios) {
        console.log("UIApplication: " + args.ios);
    }
});

application.on(application.lowMemoryEvent, (args: application.ApplicationEventData) => {
    if (args.android) {
        console.log("Activity: " + args.android);
    } else if (args.ios) {
        console.log("UIApplication: " + args.ios);
    }
});

application.on(application.uncaughtErrorEvent, (args: application.ApplicationEventData) => {
    if (args.android) {
        console.log("NativeScriptError: " + args.android);
    } else if (args.ios) {
        console.log("NativeScriptError: " + args.ios);
    }
});

let sessionService = new Session;
let connection = connectivity.getConnectionType();
if (connection == connectivity.connectionType.none) {
    sessionService.set('connection', false);
} else {
    sessionService.set('connection', true);
}

connectivity.startMonitoring(function onConnectionTypeChanged(newConnectionType: number) {
    if (newConnectionType == connectivity.connectionType.none) {
        sessionService.set('connection', false);
    } else {
        sessionService.set('connection', true);
    }
});


let user = storageService.get('student');
if (user) {
	application.start({ moduleName: 'tabs/tabs-page', clearHistory: true })
} else {
	application.start({ moduleName: 'tabs/login/login', clearHistory: true });
}
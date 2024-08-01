/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App';
import PushNotification from 'react-native-push-notification';

// PushNotification.configure({
//   onRegister: function (token) {
//     console.log('TOKEN:', token);
//   },
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);
//     notification.finish(PushNotification.FetchResult.NoData);
//   },
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },
//   popInitialNotification: true,
//   requestPermissions: true,
// });

// PushNotification.createChannel(
//   {
//     channelId: 'BackgroundServiceChannel',
//     channelName: 'Background Service Channel',
//     channelDescription:
//       'A channel to categorize your background fetch notifications',
//     playSound: true,
//     soundName: 'default',
//     importance: 4,
//     vibrate: true,
//   },
//   created => console.log(`createChannel returned '${created}'`),
// );

AppRegistry.registerComponent(appName, () => App);

import {NativeModules, NativeEventEmitter} from 'react-native';
import PushNotification from 'react-native-push-notification';
const {BackgroundServiceModule} = NativeModules;

export const startService = () => {
  return BackgroundServiceModule.startService();
};

export const stopService = () => {
  return BackgroundServiceModule.stopService();
};

const eventEmitter = new NativeEventEmitter(BackgroundServiceModule);

eventEmitter.addListener('backgroundServiceNotification', message => {
  PushNotification.localNotification({
    channelId: 'BackgroundServiceChannel',
    title: 'Background Service',
    message: message,
  });
});

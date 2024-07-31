import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, Button} from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const App = () => {
  const [logs, setLogs] = useState([]);
  const [isServiceStarted, setIsServiceStarted] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      const storedLogs = await AsyncStorage.getItem('backgroundFetchLogs');
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    };

    loadLogs();
  }, []);

  const startBackgroundService = () => {
    if (isServiceStarted) {
      console.log('Background service already started.');
      return;
    }

    // Configure the background fetch.
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
        // Android options
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
        requiresCharging: false, // Default
        requiresDeviceIdle: false, // Default
        requiresBatteryNotLow: false, // Default
        requiresStorageNotLow: false, // Default
      },
      async taskId => {
        console.log('[BackgroundFetch] taskId: ', taskId);

        // Get current time
        const timestamp = new Date().toISOString();

        // Add the new log entry to the logs array
        const newLog = `[${timestamp}] BackgroundFetch taskId: ${taskId}`;
        const updatedLogs = [...logs, newLog];

        // Save the logs to AsyncStorage
        await AsyncStorage.setItem(
          'backgroundFetchLogs',
          JSON.stringify(updatedLogs),
        );

        // Update state
        setLogs(updatedLogs);

        // Send a notification
        PushNotification.localNotification({
          channelId: 'background-fetch-channel',
          title: 'Background Fetch',
          message: `Task executed: ${taskId}`,
        });

        // Call BackgroundFetch.finish(taskId) once your task is done.
        BackgroundFetch.finish(taskId);
      },
      error => {
        console.log('[BackgroundFetch] configure error: ', error);
      },
    );

    // Optional: Query the current BackgroundFetch status.
    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled');
          break;
      }
    });

    setIsServiceStarted(true);
    console.log('Background service started.');
  };

  const triggerNotification = () => {
    PushNotification.localNotification({
      channelId: 'background-fetch-channel',
      title: 'Test Notification',
      message: 'This is a test notification',
    });
  };

  return (
    <ScrollView>
      <View>
        <Text>Background Fetch Example</Text>
        <Button
          title="Start Background Service"
          onPress={startBackgroundService}
        />
        <Button title="Trigger Notification" onPress={triggerNotification} />
        {logs.map((log, index) => (
          <Text key={index}>{log}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default App;

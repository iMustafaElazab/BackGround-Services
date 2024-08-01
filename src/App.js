import React from 'react';
import {View, Text, Button} from 'react-native';
import {startService, stopService} from './BackgroundServiceModule';

const App = () => {
  return (
    <View>
      <Text>Background Service Example</Text>
      <Button
        title="Start Background Service"
        onPress={() => {
          startService()
            .then(result => {})
            .catch(error => {
              console.log(error);
            });
        }}
      />
      <Button
        title="Stop Background Service"
        onPress={() => {
          stopService()
            .then(result => {})
            .catch(error => {
              console.log(error);
            });
        }}
      />
    </View>
  );
};

export default App;

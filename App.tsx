import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { startLocationTracking } from './src/service/locationService';
import LocationSender from './src/components/locationSender';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import axios from 'axios';

const LOCATION_TASK_NAME = 'задача-отслеживания-локации';
let globalServerUrl = '';

export default function App() {
  const [serverUrl, setServerUrl] = useState('');

  useEffect(() => {
    const initiateLocationTracking = async () => {
      try {
        await startLocationTracking(LOCATION_TASK_NAME);
      } catch (error: any) {
        console.error(error.message);
      }
    };
    initiateLocationTracking();
  }, []);

  useEffect(() => {
    globalServerUrl = serverUrl;
  }, [serverUrl]);

  return (
    <View style={styles.container}>
      <LocationSender serverUrl={serverUrl} onChangeServerUrl={setServerUrl} />
    </View>
  );
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations.length > 0) {
      try {
        await axios.post(globalServerUrl, {
          latitude: locations[0].coords.latitude,
          longitude: locations[0].coords.longitude,
        });
      } catch (error: any) {
        console.error('Ошибка отправки локации в фоновом режиме:', error);
      }
    }
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
});

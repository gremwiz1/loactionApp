import * as Location from 'expo-location';
import axios from 'axios';

export const startLocationTracking = async (taskName: string) => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Необходимо разрешение на использование местоположения.');
  }

  await Location.startLocationUpdatesAsync(taskName, {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000,
    distanceInterval: 1,
    foregroundService: {
      notificationTitle: 'Отслеживание местоположения',
      notificationBody: 'Ваше местоположение отслеживается в фоновом режиме.',
    },
  });
};

export const getForegroundLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Необходимо разрешение на использование местоположения.');
  }
  return await Location.getCurrentPositionAsync({});
};

export const sendLocationToServer = async (serverUrl: string, location: Location.LocationObject) => {
  if (!serverUrl) {
    throw new Error('Пожалуйста, укажите URL сервера для отправки данных о местоположении.');
  }
  try {
    await axios.post(serverUrl, {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  } catch (error) {
    throw new Error('Не удалось отправить данные о местоположении на сервер.');
  }
};

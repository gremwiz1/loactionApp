import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getForegroundLocation, sendLocationToServer } from '../service/locationService';

interface LocationSenderProps {
  serverUrl: string;
  onChangeServerUrl: (url: string) => void;
}

const LocationSender: React.FC<LocationSenderProps> = ({ serverUrl, onChangeServerUrl }) => {
  const handleSendLocation = async () => {
    try {
      const location = await getForegroundLocation();
      await sendLocationToServer(serverUrl, location);
      Alert.alert('Местоположение отправлено', 'Ваше местоположение успешно отправлено на сервер.');
    } catch (error: any) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Введите URL сервера:</Text>
      <TextInput
        style={styles.input}
        value={serverUrl}
        onChangeText={onChangeServerUrl}
        placeholder="https://example.com/местоположение"
      />
      <Button title="Отправить местоположение" onPress={handleSendLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
      },
      input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginVertical: 10,
      },
    });
    
    export default LocationSender;
    
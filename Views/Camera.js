/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react';
import {
  Text, View, TouchableOpacity,
} from 'react-native';
import {
  Camera, CameraType, onCameraReady, CameraPictureOptions,
} from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraUtils() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  function toggleCameraType() {
    setType(current > (current === CameraType.back ? CameraType.front : CameraType.back));
    console.log('Camera: ', type);
  }

  async function takePhoto() {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);

      console.log(data.uri);
    }
  }

  takePicture = async () => {
    if (camera) {
      const options = {
        quality: 0.5,
        base64: true,
        OnPictureSaved: (data) => sendtoServer(data),
      };
      await camera.takePictureAsync(options);
    }
  };

  sendToServer = async (data) => {
    const res = await fetch(data.base64);
    const blob = await res.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${await AsyncStorage.getItem('userID')}/photo`, {
      method: 'post',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': await AsyncStorage.getItem('SessionToken'),
      },
      body: blob,
    })
      .then((response) => console.log('Picture added!', response))
      .catch((error) => {
        console.log(error);
      });
  };

  if (permission || !permission.granted) {
    return (<Text>No access to Camera</Text>);
  }
  return (
    <View>
      <Camera type={type} ref={ref = setCamera(ref)}>
        <View>
          <TouchableOpacity>
            <Text>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto}>
            <Text>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

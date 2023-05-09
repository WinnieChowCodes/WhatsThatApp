/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable no-use-before-define */
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
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CameraUtils() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  const takePicture = async () => {
    if (camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => sendToServer(data),
      };

      await camera.takePictureAsync(options);
    }
  };

  const sendToServer = async (data) => {
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
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 400) {
          const err = 'Bad Request!';
          throw err;
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          const err = 'You do not have the correct privilages to perform this action!';
          throw err;
        }
        if (response.status === 404) {
          const err = '404 Not Found';
          throw err;
        } else {
          const err = 'Server Error! Please try again later!';
          throw err;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!permission || !permission.granted) {
    return (<Text>No Access to Camera!</Text>);
  }
  return (
    <View style={{ height: '100vh' }}>
      <Camera type={type} ref={(ref) => setCamera(ref)}>
        <View style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'center',
        }}
        >
          <TouchableOpacity onPress={takePicture} style={{ backgroundColor: '#3a75b5', width: 80 }}>
            <Ionicons name="camera-outline" size="large" style={{ fontSize: 64 }} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

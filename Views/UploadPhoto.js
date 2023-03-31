import React, { Component } from 'react';
import { View } from 'react-native';
import CameraUtils from './utils/Camera';

class UploadPhoto extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <CameraUtils />
      </View>
    );
  }
}

export default UploadPhoto;

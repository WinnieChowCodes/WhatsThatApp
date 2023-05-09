/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { TextInput } from 'react-native-web';
import { Button } from '@rneui/themed';

class UpdateDrafts extends Component {
  styles = StyleSheet.create({
  });

  constructor(props) {
    super(props);

    this.state = {
      allDrafts: [],
    };
  }

  // Executes as soon as the component renders
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({ allDrafts: JSON.parse(await AsyncStorage.getItem('drafts')) });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <View style={this.styles.container}>
        <Text>Update Draft</Text>
        <TextInput />
        <Button />
      </View>
    );
  }
}

export default UpdateDrafts;

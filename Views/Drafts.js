/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';

class Drafts extends Component {
  styles = StyleSheet.create({
  });

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <View style={this.styles.container}>
        <Text>Drafts</Text>
      </View>
    );
  }
}

export default Drafts;

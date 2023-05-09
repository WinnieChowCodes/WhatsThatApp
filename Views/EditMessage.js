/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditMessage extends Component {
  styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 25,
    },
    formFields: {
      backgroundColor: '#dadfeb',
      margin: 5,
      padding: 10,
      borderRadius: '20px',
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      margin: 5,
      backgroundColor: '#2196F3',
    },
    buttonText: {
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
    title: {
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      newMessage: '',
      error: '',
    };

    this.updateMessage = this.updateMessage.bind(this);
  }

  async componentDidMount() {
    this.setState({
      newMessage: await AsyncStorage.getItem('message'),
    });
  }

  messageHandler = (message) => {
    this.setState({
      newMessage: message,
    });
  };

  async updateMessage() {
    const toPatch = { message: this.state.newMessage };
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chatID')}/message/${await AsyncStorage.getItem('messageID')}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
      body: JSON.stringify(toPatch),
    })
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 400) {
          const err = 'Something went wrong, please try again later';
          throw err;
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          const err = 'You do not have the correct permission to perform this action';
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
      .then(() => {
        this.props.navigation.navigate('Chat');
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  render() {
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.title}>Update Message</Text>
        <TextInput style={this.styles.formFields} placeholder="Message..." onChangeText={this.messageHandler} value={this.state.newMessage} />
        <TouchableOpacity style={this.styles.button} onPress={this.updateMessage}>
          <Text style={this.styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}

export default EditMessage;

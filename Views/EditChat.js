/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditChat extends Component {
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
      newChatName: '',
      error: '',
    };

    this.editChatTitle = this.editChatTitle.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chatID')}`, {
      method: 'get',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          throw new Error('You do not have the correct permission to perform this action');
        }
        if (response.status === 404) {
          throw new Error('404 Not Found');
        } else {
          throw new Error('Server Error! Please try again later!');
        }
      })
      .then((responseJson) => {
        this.setState({
          newChatName: responseJson.name,
        });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  chatTitleHandler = (chatName) => {
    this.setState({
      newChatName: chatName,
    });
  };

  async editChatTitle() {
    const toPatch = { name: this.state.newChatName };
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chatID')}`, {
      method: 'PATCH',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('SessionToken'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toPatch),
    })
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 400) {
          throw new Error('Something went wrong - please check your fields');
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          throw new Error('You do not have the correct permission to perform this action');
        }
        if (response.status === 404) {
          throw new Error('404 Not Found');
        } else {
          throw new Error('Server Error! Please try again later!');
        }
      })
      .then(() => {
        this.setState({
          error: 'Chat Name Successfully Changed!',
        });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  render() {
    const { state } = this;
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.title}>Update Chat Info</Text>
        <TextInput style={this.styles.formFields} placeholder="New Chat Name..." onChangeText={this.chatTitleHandler} value={state.newChatName} />
        <TouchableOpacity
          style={this.styles.button}
          onPress={this.editChatTitle}
        >
          <Text style={this.styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <Text>{state.error}</Text>
      </View>
    );
  }
}

export default EditChat;

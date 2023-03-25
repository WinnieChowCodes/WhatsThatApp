/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import {
  FlatList, TouchableOpacity,
} from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ModalUtil from './utils/Modal';

class ChatList extends Component {
  styles = StyleSheet.create({
    header: {
      backgroundColor: '#3a75b5',
      padding: 10,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
    },
    chatStyle: {
      backgroundColor: '#d7dce0',
      margin: 10,
    },
    chatTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttonStyle: {
      backgroundColor: '#3a75b5',
      padding: 10,
      width: 100,
    },

  });

  constructor(props) {
    super(props);

    this.state = {
      chatsListData: [],
    };
  }

  // Executes as soon as the component renders
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.getData();
      await AsyncStorage.removeItem('chatID');
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async getData() {
    return fetch('http://localhost:3333/api/1.0.0/chat', {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          chatsListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getSingleChatHandler(chatID) {
    try {
      await AsyncStorage.setItem('chatID', chatID);
      this.props.navigation.navigate('Chat');
    } catch {
      return 'Something went wrong!';
    }
    return null;
  }

  determineLastMessage = (lastMessage) => {
    if (lastMessage.message === undefined) {
      return 'No Messages!';
    }

    return `${lastMessage.author.first_name}: ${lastMessage.message}`;
  };

  render() {
    if (this.state.chatsListData.length === 0) {
      return (
        <View>
          <Text>No Current Chats! Start a new chat</Text>
          <ModalUtil />
        </View>
      );
    }

    return (
      <View>
        <ModalUtil />
        <FlatList
          data={this.state.chatsListData}
          renderItem={({ item }) => (
            <View>
              <br />
              <TouchableOpacity
                style={this.styles.chatStyle}
                onPress={() => this.getSingleChatHandler(item.chat_id)}
              >
                <Text style={this.styles.chatTitle}>{item.name}</Text>
                <Text>
                  Created By:
                  {item.creator.first_name}
                </Text>
                <Text>{this.determineLastMessage(item.last_message)}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={({ userId }) => userId}
        />
      </View>
    );
  }
}

export default ChatList;

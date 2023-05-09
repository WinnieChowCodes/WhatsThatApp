/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  Text, View,
} from 'react-native';
import {
  FlatList, TouchableOpacity,
} from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListItem } from '@rneui/themed';
import { ListItemContent } from '@rneui/base/dist/ListItem/ListItem.Content';
import ModalUtil from './utils/Modal';

class ChatList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatsListData: [],
      error: '',
    };
  }

  // Executes as soon as the component renders
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.getData();
      await AsyncStorage.setItem('chatID', '');
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
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          const err = 'You do not have the correct privilages to perform this action!';
          throw err;
        } else {
          const err = 'Server Error! Please try again later!';
          throw err;
        }
      })
      .then((responseJson) => {
        this.setState({
          chatsListData: responseJson,
        });
      })
      .catch((err) => {
        this.setState({ error: err });
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
      <>
        <ModalUtil />
        <Text>{this.state.error}</Text>
        <FlatList
          data={this.state.chatsListData}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                onPress={() => this.getSingleChatHandler(item.chat_id)}
              >
                <ListItem bottomDivider>
                  <ListItemContent>
                    <ListItem.Title>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>
                      Created by
                      {' '}
                      {item.creator.first_name}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle>
                      {this.determineLastMessage(item.last_message)}
                    </ListItem.Subtitle>
                  </ListItemContent>
                </ListItem>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={({ userId }) => userId}
        />

      </>
    );
  }
}

export default ChatList;

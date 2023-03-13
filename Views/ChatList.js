import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image, Modal } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ModalUtil from './utils/Modal';

class ChatList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      isLoading: true,
      chatsListData: [],
      newChatName: "",
      modalVisible: false
    }
  }

  async componentDidMount() {
    this.getData();
    await AsyncStorage.removeItem("chatID");
  };

  async getData() {
    return fetch("http://localhost:3333/api/1.0.0/chat", {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem("SessionToken")
      }
    }) 
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          chatsListData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getSingleChatHandler(chatID) {
    try{
      await AsyncStorage.setItem("chatID", chatID)
      this.props.navigation.navigate('Chat')

    }catch{
      throw "Something went wrong!"
    }
  }

  styles = StyleSheet.create({
    header:{
      backgroundColor: '#3a75b5',
      padding: 10,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20
    },
    chatStyle: {
      backgroundColor: '#d7dce0',
      margin: 10
    },
    chatTitle: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    buttonStyle:{
      backgroundColor: '#3a75b5',
      padding: 10,
      width: 100
    }

  })

  render() {
    if (this.state.chatsListData.length == 0) {
      return (
        <View>
          <Text>No Current Chats! Start a new chat</Text>
          <ModalUtil/>
        </View>
      )
    }
    else {
      return (
        <View>
          <FlatList
            data={this.state.chatsListData}
            renderItem={({ item }) => (
              <View>
                <br />
                <TouchableOpacity style={this.styles.chatStyle} onPress={() => this.getSingleChatHandler(item.chat_id)}>
                  <Text style={this.styles.chatTitle}>{item.name}</Text>
                  <Text>Created By: {item.creator.first_name}</Text>
                  <Text>Last Message: </Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={({ user_id }, index) => user_id} />
            <ModalUtil/>
        </View>
      )
    }
  }
}

export default ChatList

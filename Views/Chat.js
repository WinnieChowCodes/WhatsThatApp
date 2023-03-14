import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      chatsListData: [],
      message: ""
    }

    this.sendMessage = this.sendMessage.bind(this)
  }

  componentDidMount() {
    this.getData();
  };

  async getData() {
    return fetch("http://localhost:3333/api/1.0.0/chat/"+await AsyncStorage.getItem("chatID"), {
      method: 'get',
      headers: {
        'X-Authorization': await AsyncStorage.getItem("SessionToken")
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

  async sendMessage(){
    let data={
      message: this.state.message
    };
    return fetch("http://localhost:3333/api/1.0.0/chat/"+await AsyncStorage.getItem("chatID")+"/message", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': await AsyncStorage.getItem("SessionToken")
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      });
  }  

  messageHandler = (newMessage) => {
    this.setState({message:newMessage});
  }

  styles = StyleSheet.create({
    container:{
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      flex: 1
    },
    messageSendContainer:{
      display: 'flex',
      justifyContent: "space-between",
      flexDirection: 'row',
      padding: 5,
    },
    messageInput:{
      backgroundColor: '#ede7e6',
      padding: 10,
      width: '100%',
    },
    messageSend:{
      backgroundColor: '#3a75b5',
      padding: 10,
      width: 100
    },
    header: {
      backgroundColor: '#3a75b5',
      padding: 10,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20
    },
    chatStyle: {
      backgroundColor: '#d7dce0',
    },
    chatTitle: {
      fontSize: 20,
      fontWeight: 'bold'
    }
  })
  render() {
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.header}>{this.state.chatsListData.name}</Text>
        <TouchableOpacity 
        onPress={()=> this.props.navigation.navigate('EditChat',{
          chatsListData: this.state.chatsListData
        })}>
          <Text>Edit Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> this.props.navigation.navigate('EditChatUsers')}>
          <Text>Edit Users</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.chatsListData.messages}
          renderItem={({ item }) => (
            <View style={this.styles.chatStyle}>
              <Text>{item.author.first_name} {item.author.last_name}</Text>
              <Text>{item.message}</Text>
              <Text>{item.timestamp}</Text> 
            </View>
          )}
          keyExtractor={({ chat_id }, index) => chat_id} />
          <View style={this.styles.messageSendContainer}>
          <TextInput placeholder='Message...' style={this.styles.messageInput} onChangeText={this.messageHandler} value={this.state.message}></TextInput>
          <TouchableOpacity style={this.styles.messageSend} onPress={this.sendMessage}>
            <Text>Submit</Text>
          </TouchableOpacity>
          </View>
      </View>
    )
  }
}

export default Chat

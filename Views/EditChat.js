import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image, Modal } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatsListData: [],
      newChatName: "",
      error: ""
    }

    this.editChatTitle = this.editChatTitle.bind(this)
  }

  async getData() {
    return fetch("http://localhost:3333/api/1.0.0/chat/" + await AsyncStorage.getItem("chatID"), {
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

  async editChatTitle() {
    let toPatch = { name: this.state.newChatName }
    return fetch("http://localhost:3333/api/1.0.0/chat/" + await AsyncStorage.getItem("chatID"), {
      method: 'PATCH',
      headers: {
        'X-Authorization': await AsyncStorage.getItem("SessionToken"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toPatch)
    })
      .then(() => {
        this.setState({
          error: "Chat Name Successfully Changed!"
        })
      })
  }

  chatTitleHandler = (chatName) => {
    this.setState({
      newChatName: chatName
    })
    console.log(this.state.newChatName)
  }

  styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 25
    },
    formFields: {
      backgroundColor:'#dadfeb',
      margin: 5,
      padding: 10,
      borderRadius: '20px'
    },
    button:{
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      margin:5,
      backgroundColor:'#2196F3'
    },
    buttonText: {
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
    title: {
      textAlign: 'center',
      fontWeight: 'bold',
    }
  })

  render() {
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.title} >Update Chat Info</Text>
        <TextInput style={this.styles.formFields} placeholder="New Chat Name..." onChangeText={this.chatTitleHandler} value={this.state.newChatName} />
        <TouchableOpacity style={this.styles.button} onPress={this.editChatTitle}>
          <Text style={this.styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <Text>{this.state.error}</Text>
      </View>
    )
  }
}

export default EditChat

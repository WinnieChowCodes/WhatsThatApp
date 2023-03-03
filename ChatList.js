import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
class ChatList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      isLoading: true,
      chatsListData: [],
    }
  }

  componentDidMount() {
    this.getData();
  };

  getData() {
    return fetch("http://localhost:3333/api/1.0.0/chat", {
      method: 'get',
      headers: {
        'x-authorization': '3313ab47c37376f7e67d5e2af486483a'
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
    },
    chatTitle: {
      fontSize: 20,
      fontWeight: 'bold'
    }
  })
  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    if(this.state.chatsListData.length ==0){
      return(
        <View>
           <Text style={this.styles.header}>Chats</Text>
           <Text>No Current Blocked Users!</Text>
        </View>
      )
    }
    else {
      return (
        <View>
          <Text style={this.styles.header}>Chats</Text>
          <FlatList
            data={this.state.chatsListData}
            renderItem={({ item }) => (
              <View>
                <br/>
                <TouchableOpacity style={this.styles.chatStyle}>
                  <Text style={this.styles.chatTitle}>{item.name}</Text>
                  <Text>{item.last_message.author.first_name}: {item.last_message.message}</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={({ user_id }, index) => user_id} />
        </View>
      )
    }
  }
}

export default ChatList

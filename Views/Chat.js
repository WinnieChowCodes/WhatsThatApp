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
    }
  }

  componentDidMount() {
    this.getData();
  };

  async getData() {
    return fetch("http://localhost:3333/api/1.0.0/chat/1", {
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
            <Text style={this.styles.header}>{this.state.chatsListData.name}</Text>
           <Text>No Current Messages, start the conversation!</Text>
        </View>
      )
    }
    else {
      return (
        <View>
          <Text style={this.styles.header}>{this.state.chatsListData.name}</Text>
          <FlatList
            data={this.state.chatsListData}
            renderItem={({ item }) => (
              <View>
                <Text>{item.messages[0].message}</Text>
                <br/>
              </View>
            )}
            keyExtractor={({ chat_id }, index) => chat_id} />
        </View>
      )
    }
  }
}

export default Chat

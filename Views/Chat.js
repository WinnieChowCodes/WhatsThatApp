/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Chat extends Component {
  styles = StyleSheet.create({
    container: {
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      flex: 1,
    },
    messageSendContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      padding: 5,
    },
    messageInput: {
      backgroundColor: '#ede7e6',
      padding: 10,
      width: '100%',
    },
    messageSend: {
      backgroundColor: '#3a75b5',
      padding: 10,
      width: 100,
    },
    header: {
      backgroundColor: '#3a75b5',
      padding: 10,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
    },
    messageStyle: {
      backgroundColor: '#d7dce0',
      margin: 5,
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    messageTitle: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      padding: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      margin: 5,
      backgroundColor: '#2196F3',
      width: '25%',
      flexWrap: 'wrap',
    },
    buttonText: {
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
    },

  });

  constructor(props) {
    super(props);

    this.state = {
      chatsListData: [],
      message: '',
      messageID: '',
    };

    this.sendMessage = this.sendMessage.bind(this);
  }

  // Executes as soon as the component renders
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async getData() {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chatID')}`, {
      method: 'get',
      headers: {
        'X-Authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          chatsListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  messageHandler = (newMessage) => {
    this.setState({ message: newMessage });
  };

  deleteMessageHandler = (ID) => {
    this.setState({
      messageID: ID,
    }, () => {
      this.deleteMessage();
    });
  };

  updateMessageHandler = async (ID, message) => {
    await AsyncStorage.setItem('messageID', ID);
    await AsyncStorage.setItem('message', message);
    this.props.navigation.navigate('EditMessage');
  };

  convertDateTime = (epochDateTime) => {
    const date = new Date(epochDateTime);
    const dateFormat = `${date.getHours()}:${date.getMinutes()} ${date.toDateString()}`;
    return dateFormat;
  };

  async sendMessage() {
    const data = {
      message: this.state.message,
    };
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chatID')}/message`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        this.getData();
        this.setState({
          message: '',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async deleteMessage() {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chatID')}/message/${this.state.messageID}`, {
      method: 'delete',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then(() => {
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.header}>{this.state.chatsListData.name}</Text>
        <View style={this.styles.buttonContainer}>
          <TouchableOpacity style={this.styles.button} onPress={() => this.props.navigation.navigate('EditChat')}>
            <Text style={this.styles.buttonText}>Edit Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.styles.button} onPress={() => this.props.navigation.navigate('EditChatUsers')}>
            <Text style={this.styles.buttonText}>Edit Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={this.styles.button} onPress={() => this.props.navigation.navigate('Drafts')}>
            <Text style={this.styles.buttonText}>Drafts</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.chatsListData.messages}
          renderItem={({ item }) => (
            <View style={this.styles.messageStyle}>
              <View>
                <Text>
                  {item.author.first_name}
                  {' '}
                  {item.author.last_name}
                  :
                </Text>
                <Text>{item.message}</Text>
                <Text>{this.convertDateTime(item.timestamp)}</Text>
              </View>
              <View style={this.styles.buttonContainer}>
                <TouchableOpacity style={[this.styles.button, { backgroundColor: 'gray' }]} onPress={() => this.deleteMessageHandler(item.message_id)}>
                  <Text style={this.styles.buttonText}>x</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[this.styles.button, { backgroundColor: 'gray' }]} onPress={() => this.updateMessageHandler(item.message_id, item.message)}>
                  <Text style={this.styles.buttonText}>:</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={({ chatId }) => chatId}
        />
        <View style={this.styles.messageSendContainer}>
          <TouchableOpacity style={this.styles.messageSend} onPress={this.sendMessage}>
            <Text style={this.styles.buttonText}>Add to Draft</Text>
          </TouchableOpacity>
          <TextInput placeholder="Message..." style={this.styles.messageInput} onChangeText={this.messageHandler} value={this.state.message} />
          <TouchableOpacity style={this.styles.messageSend} onPress={this.sendMessage}>
            <Text style={this.styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Chat;

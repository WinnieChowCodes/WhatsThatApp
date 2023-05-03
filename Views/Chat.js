/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      display: 'flex',
      flexDirection: 'row',
      padding: 5,
      backgroundColor: 'white',
    },
    messageStyleRight: {
      backgroundColor: '#0078fe',
      padding: 10,
      marginLeft: '45%',
      borderRadius: 20,

      marginTop: 5,
      marginRight: '5%',
      maxWidth: '50%',
      alignSelf: 'flex-end',
    },
    messageStyleLeft: {
      backgroundColor: '#dedede',
      padding: 10,
      marginTop: 5,
      marginLeft: '5%',
      maxWidth: '50%',
      alignSelf: 'flex-start',
      borderRadius: 20,
    },
    messageLeftText: {
      fontSize: 16,
    },
    messageRightText: {
      fontSize: 16,
      color: 'white',
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
    rightArrow: {
      position: 'absolute',
      backgroundColor: '#0078fe',
      // backgroundColor:"red",
      width: 20,
      height: 25,
      bottom: 0,
      borderBottomLeftRadius: 25,
      right: -10,
    },
    rightArrowOverlap: {
      position: 'absolute',
      backgroundColor: '#eeeeee',
      // backgroundColor:"green",
      width: 20,
      height: 35,
      bottom: -6,
      borderBottomLeftRadius: 18,
      right: -20,
    },
    /* Arrow head for recevied messages */
    leftArrow: {
      position: 'absolute',
      backgroundColor: '#dedede',
      // backgroundColor:"red",
      width: 20,
      height: 25,
      bottom: 0,
      borderBottomRightRadius: 25,
      left: -10,
    },

    leftArrowOverlap: {
      position: 'absolute',
      backgroundColor: '#eeeeee',
      width: 20,
      height: 35,
      bottom: -6,
      borderBottomRightRadius: 18,
      left: -20,

    },

  });

  constructor(props) {
    super(props);

    this.state = {
      chatsListData: [],
      message: '',
      messageID: '',
      error: '',
      currentUserID: 0,
    };

    this.sendMessage = this.sendMessage.bind(this);
  }

  // Executes as soon as the component renders
  async componentDidMount() {
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
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        } else {
          const err = 'Server Error! Please try again later!';
          throw err;
        }
      })
      .then(async (responseJson) => {
        this.setState({
          chatsListData: responseJson,
        });
        this.setState({ currentUserID: parseInt(await AsyncStorage.getItem('userID')) });
      })
      .catch((err) => {
        this.setState({ error: err });
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

  addToDrafts = async () => {
    await AsyncStorage.setItem('message', this.state.message);
    this.props.navigation.navigate('AddDraft');
  };

  getStyle = (id) => {
    if (id === this.state.currentUserID) {
      return this.styles.messageStyleRight;
    } else {
      return this.styles.messageStyleLeft;
    }
  };

  getStyleArrow = (id) => {
    if (id === this.state.currentUserID) {
      return this.styles.rightArrow;
    } else {
      return this.styles.leftArrow;
    }
  };

  getStyleArrowOverlap = (id) => {
    if (id === this.state.currentUserID) {
      return this.styles.rightArrowOverlap;
    } else {
      return this.styles.leftArrowOverlap;
    }
  };

  getStyleMessageText = (id) => {
    if (id === this.state.currentUserID) {
      return this.styles.messageRightText;
    } else {
      return this.styles.messageLeftText;
    }
  };

  // determines if the current message has been sent by the logged in user -
  // displays delete/update buttons
  determineCurrentUser = (userID, messageID, message) => {
    if (userID === this.state.currentUserID) {
      return (
        <View style={{
          marginLeft: '85%',
          display: 'flex',
          flexDirection: 'row',
          padding: 5,
        }}
        >
          <TouchableOpacity onPress={() => this.deleteMessageHandler(messageID)}>
            <Ionicons name="trash-outline" size="small" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.updateMessageHandler(messageID, message)}
          >
            <Ionicons name="pencil-outline" size="small" />
          </TouchableOpacity>
        </View>
      );
    }
  };

  getRecievedMessageName = (id, name) => {
    if (id !== this.state.currentUserID) {
      return (<Text>{name}</Text>);
    }
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
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          err = 'You do not have the correct privilages to perform this action!';
          throw err;
        } else {
          err = 'Server Error! Please try again later!';
          throw err;
        }
      })
      .then(() => {
        this.getData();
        this.setState({
          message: '',
        });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  async deleteMessage() {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chatID')}/message/${this.state.messageID}`, {
      method: 'delete',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          err = 'You do not have the correct privilages to perform this action!';
          throw err;
        } else {
          err = 'Server Error! Please try again later!';
          throw err;
        }
      })
      .then(() => {
        this.getData();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  render() {
    return (
      <View style={this.styles.container}>
        <View style={this.styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
            <Ionicons name="arrow-back-outline" size="large" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20 }}>{this.state.chatsListData.name}</Text>
        </View>
        <Text>{this.state.error}</Text>
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
            <View>
              <View>
                {this.getRecievedMessageName(
                  item.author.user_id,
                  `${item.author.first_name} ${item.author.last_name}`,
                )}
              </View>
              <View style={this.getStyle(item.author.user_id)}>
                <Text style={this.getStyleMessageText(item.author.user_id)}>{item.message}</Text>
                <Text
                  style={this.getStyleMessageText(item.author.user_id)}
                >
                  {this.convertDateTime(item.timestamp)}
                </Text>
                <View style={this.getStyleArrow(item.author.user_id)} />
                <View style={this.getStyleArrowOverlap(item.author.user_id)} />
              </View>

              <View>
                {
                  this.determineCurrentUser(
                    item.author.user_id,
                    item.message_id,
                    item.message,
                  )
                }
              </View>
            </View>
          )}
          keyExtractor={({ chatId }) => chatId}
        />
        <View style={this.styles.messageSendContainer}>
          <TouchableOpacity style={this.styles.messageSend} onPress={this.addToDrafts}>
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

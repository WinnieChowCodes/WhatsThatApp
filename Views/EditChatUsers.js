/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import {
  FlatList, TouchableOpacity,
} from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditChatUsers extends Component {
  styles = StyleSheet.create({
    container: {
      display: 'flex',
    },
    userContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      padding: 5,
      backgroundColor: '#d7dce0',
      margin: 5,
    },
    headings: {
      fontWeight: 'bold',
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
      fontWeight: 'bold',
      color: 'white',
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      chatsListData: [],
      contactsListData: [],
      userID: 0,
      error: '',
    };
  }

  componentDidMount() {
    this.getChatData();
    this.getContactsData();
  }

  async getChatData() {
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

  async getContactsData() {
    return fetch('http://localhost:3333/api/1.0.0/contacts', {
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
          isLoading: false,
          contactsListData: responseJson,
        });
      })
      .catch((error) => {
        this.setState({ errorMessage: error });
      });
  }

  addUserHandler = (ID) => {
    this.setState({
      userID: ID,
    }, () => {
      this.addUser();
    });
  };

  removeUserHandler = (ID) => {
    this.setState({
      userID: ID,
    }, () => {
      this.removeUser();
    });
  };

  async addUser() {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chatID')}/user/${this.state.userID}`, {
      method: 'post',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 400) {
          const err = 'Something went wrong, please try again later';
          throw err;
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          const err = 'You do not have the correct permission to perform this action';
          throw err;
        }
        if (response.status === 404) {
          const err = '404 Not Found';
          throw err;
        } else {
          const err = 'Server Error! Please try again later!';
          throw err;
        }
      })
      .then(() => {
        this.getChatData();
        this.getContactsData();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  async removeUser() {
    return fetch(`http://localhost:3333/api/1.0.0/chat/${await AsyncStorage.getItem('chatID')}/user/${this.state.userID}`, {
      method: 'delete',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 400) {
          const err = 'Something went wrong, please try again later';
          throw err;
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          const err = 'You do not have the correct permission to perform this action';
          throw err;
        }
        if (response.status === 404) {
          const err = '404 Not Found';
          throw err;
        } else {
          const err = 'Server Error! Please try again later!';
          throw err;
        }
      })
      .then(() => {
        this.getChatData();
        this.getContactsData();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  render() {
    const { state } = this;
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.headings}>Current Group Members</Text>
        <FlatList
          data={state.chatsListData.members}
          renderItem={({ item }) => (
            <View style={this.styles.userContainer}>
              <Text>
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>
              <Text>{item.email}</Text>
              <TouchableOpacity
                style={this.styles.button}
                onPress={() => this.removeUserHandler(item.user_id)}
              >
                <Text style={this.styles.buttonText}>Remove User</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={({ chatId }) => chatId}
        />
        <Text style={this.styles.headings}>Add a Member</Text>
        <FlatList
          data={state.contactsListData}
          renderItem={({ item }) => (
            <View style={this.styles.userContainer}>
              <Text>
                {item.first_name}
                {' '}
                {item.last_name}
              </Text>
              <Text>{item.email}</Text>
              <TouchableOpacity
                style={this.styles.button}
                onPress={() => this.addUserHandler(item.user_id)}
              >
                <Text style={this.styles.buttonText}>Add User</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={({ chatId }) => chatId}
        />
      </View>
    );
  }
}

export default EditChatUsers;

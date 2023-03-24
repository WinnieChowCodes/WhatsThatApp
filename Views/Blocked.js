/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Blocked extends Component {
  styles = StyleSheet.create({
    header: {
      backgroundColor: '#3a75b5',
      padding: 10,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
    },
    search: {
      placeholderTextColor: 'gray',
      backgroundColor: '#e8e5e3',
    },
    userButton: {
      backgroundColor: '#3a75b5',
      padding: 10,
      width: 100,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    userContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      padding: 5,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contactsListData: [],
      blockedID: 0,
      unblockMessage: '',
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    this.getData();
  }

  async getData() {
    return fetch('http://localhost:3333/api/1.0.0/blocked', {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          contactsListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  unblockContactHandler = (ID) => {
    this.setState({
      isLoading: true,
      blockedID: ID,
    }, () => {
      this.unblock();
    });
  };

  async unblock() {
    const item = this.state;
    return fetch(`http://localhost:3333/api/1.0.0/user/${item.blockedID}/block`, {
      method: 'delete',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then(() => {
        this.setState({
          isLoading: false,
          unblockMessage: 'Contact Unblocked',
        });
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { state } = this;
    if (state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    if (state.contactsListData.length === 0) {
      return (
        <View>
          <Text style={this.styles.header}>Contacts</Text>
          <Text>No Current Blocked Users!</Text>
        </View>
      );
    }

    return (
      <View>
        <Text>{state.unblockMessage}</Text>
        <FlatList
          data={state.contactsListData}
          renderItem={({ item }) => (
            <View style={this.styles.userContainer}>
              <br />
              <View>
                <Text>
                  {item.first_name}
                  {' '}
                  {item.last_name}
                </Text>
                <Text>{item.email}</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={this.styles.userButton}
                  onPress={() => this.unblockContactHandler(item.user_id)}
                >
                  <Text style={this.styles.buttonText}>Unblock User</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={({ userId }) => userId}
        />
      </View>
    );
  }
}

export default Blocked;

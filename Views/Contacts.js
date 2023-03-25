/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import {
  ActivityIndicator, FlatList, TouchableOpacity,
} from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Contacts extends Component {
  styles = StyleSheet.create({
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
      deleteContactID: 0,
      blockContactID: 0,
      errorMessage: '',
    };
  }

  // Executes as soon as the component renders
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.getData();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  async getData() {
    return fetch('http://localhost:3333/api/1.0.0/contacts', {
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

  deleteContactHandler = (ID) => {
    this.setState({
      isLoading: true,
      deleteContactID: ID,
    }, () => {
      this.deleteContact();
    });
  };

  blockContactHandler = (ID) => {
    this.setState({
      isLoading: true,
      blockContactID: ID,
    }, () => {
      this.blockContact();
    });
  };

  async deleteContact() {
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.deleteContactID}/contact`, {
      method: 'delete',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then(() => {
        this.setState({
          isLoading: false,
          errorMessage: 'Contact Removed',
        });
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async blockContact() {
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.blockContactID}/block`, {
      method: 'post',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then(() => {
        this.setState({
          isLoading: false,
          errorMessage: 'Contact Blocked',
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
          <Text>No Current Contacts!</Text>
        </View>
      );
    }

    return (
      <View>
        <Text>{state.errorMessage}</Text>
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
                  onPress={() => this.deleteContactHandler(item.user_id)}
                >
                  <Text style={this.styles.buttonText}>Remove Contact</Text>
                </TouchableOpacity>
                <br />
                <TouchableOpacity
                  style={this.styles.userButton}
                  onPress={() => this.blockContactHandler(item.user_id)}
                >
                  <Text style={this.styles.buttonText}>Block User</Text>
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

export default Contacts;

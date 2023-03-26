/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet,
} from 'react-native';
import {
  ActivityIndicator, FlatList, TouchableOpacity,
} from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Users extends Component {
  styles = StyleSheet.create({
    ViewContainer: {
      display: 'flex',
      flex: 1,
    },
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
    contactSuccessMessage: {
      backgroundColor: '#3ae07a',
      padding: 10,
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
      query: '',
      isLoading: true,
      usersListData: [],
      contactID: 0,
      contactMessage: '',
    };
    this.addContact = this.addContact.bind(this);
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
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.query}`, {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          usersListData: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addContactHandler = (ID) => {
    this.setState({
      isLoading: true,
      contactID: ID,
    }, () => {
      this.addContact();
    });
  };

  // Stores the value of the query in the relevant state
  searchHandler = (newQuery) => {
    const state = this;
    this.setState({ query: newQuery });
    console.log(state.query);
  };

  // Performs a search of users
  searchUsers = () => {
    this.setState({ isLoading: false });
    this.getData();
  };

  // Performs a POST request to add a new contact
  async addContact() {
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.contactID}/contact`, {
      method: 'post',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then(() => {
        this.setState({
          isLoading: false,
          contactMessage: 'User added to Contacts',
        });
        return (<Text style={this.styles.contactSuccessMessage}>{this.state.contactMessage}</Text>);
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

    return (
      <View style={this.styles.ViewContainer}>
        <TextInput placeholder="Search..." style={this.styles.search} onChangeText={this.searchHandler} value={state.query} />
        <Button title="Search" onPress={this.searchUsers} />
        <FlatList
          data={state.usersListData}
          renderItem={({ item }) => (
            <View style={this.styles.userContainer}>
              <br />
              <View>
                <Text>
                  {item.given_name}
                  {' '}
                  {item.family_name}
                </Text>
                <Text>{item.email}</Text>
              </View>
              <View>
                <TouchableOpacity
                  style={this.styles.userButton}
                  onPress={() => this.addContactHandler(item.user_id)}
                >
                  <Text style={this.styles.buttonText}>Add To Contacts</Text>
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

export default Users;

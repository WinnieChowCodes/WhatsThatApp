/* eslint-disable no-return-assign */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import {
  ActivityIndicator, FlatList, TouchableOpacity,
} from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ListItem } from '@rneui/themed';
import { Avatar } from '@rneui/base';

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
      width: '100vw',
    },
    searchContainer: {
      display: 'flex',
      flexDirection: 'row',
      padding: 5,
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
      error: '',
      pageIndex: 0,
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
    return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.query}&limit=5&offset=${this.state.pageIndex}`, {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          const err = 'Something Went Wrong! Please check your fields!';
          throw err;
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 404) {
          const err = '404 not found';
          throw err;
        } else {
          const err = 'Server Error! Please try again later!';
          throw err;
        }
      })

      .then((responseJson) => {
        this.setState({
          isLoading: false,
          usersListData: responseJson,
        });
      })
      .catch((err) => {
        this.setState({ error: err });
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
    this.setState({ query: newQuery });
  };

  // Performs a search of users
  searchUsers = () => {
    // this.setState({ isLoading: false });
    this.getData();
  };

  // loads the next page of users
  loadNextPage = () => {
    const nextIndex = this.state.pageIndex + 5;
    this.setState({ pageIndex: nextIndex }, () => this.getData());
  };

  loadPreviousPage = () => {
    const nextIndex = this.state.pageIndex - 5;
    this.setState({ pageIndex: nextIndex }, () => this.getData());
  };

  // Performs a POST request to add a new contact
  async addContact() {
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.contactID}/contact`, {
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
          const err = 'You cannot add yourself as a contact';
          throw err;
        }
        if (response.status === 401) {
          // User is unauthorised - return to login screen
          this.props.navigation.navigate('Login');
        }
        if (response.status === 403) {
          const err = 'You do not have the correct permissions to perform this action!';
          throw err;
        }
        if (response.status === 404) {
          const err = '404 not found';
          throw err;
        } else {
          const err = 'Server Error! Please try again later!';
          throw err;
        }
      })
      .then(() => {
        this.setState({
          isLoading: false,
          contactMessage: 'User added to Contacts',
        });
        return (<Text style={this.styles.contactSuccessMessage}>{this.state.contactMessage}</Text>);
      })
      .catch((err) => {
        this.setState({ isLoading: false, error: err });
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
        <Text>{this.state.error}</Text>
        <View style={this.styles.searchContainer}>
          <TextInput placeholder="Search..." style={this.styles.search} onChangeText={this.searchHandler} value={state.query} />
          <TouchableOpacity onPress={this.searchUsers}>
            <Ionicons name="search-outline" size="large" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={state.usersListData}
          renderItem={({ item }) => (
            <ListItem bottomDivider>
              <Avatar
                rounded
                source={{ uri: '../Images/default.jpeg' }}
              />
              <ListItem.Content>
                <ListItem.Title>
                  {item.given_name}
                  {' '}
                  {item.family_name}
                </ListItem.Title>
                <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
              </ListItem.Content>
              <View>
                <TouchableOpacity
                  onPress={() => this.addContactHandler(item.user_id)}
                >
                  <Ionicons name="person-add-outline" size="large" />
                </TouchableOpacity>
              </View>
            </ListItem>
          )}
          keyExtractor={({ userId }) => userId}
        />
        <View style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.loadPreviousPage}>
            <Ionicons name="arrow-back-outline" size="large" style={{ fontSize: 32 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.loadNextPage}>
            <Ionicons name="arrow-forward-outline" size="large" style={{ fontSize: 32 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Users;

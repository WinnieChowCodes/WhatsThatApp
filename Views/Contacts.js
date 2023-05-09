/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, View,
} from 'react-native';
import {
  ActivityIndicator, FlatList, TouchableOpacity,
} from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ListItem } from '@rneui/themed';
import { Avatar } from '@rneui/base';

class Contacts extends Component {
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
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 400) {
          throw new Error('You cannot remove yourself as a contact');
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
      .then(() => {
        this.setState({
          isLoading: false,
          errorMessage: 'Contact Removed',
        });
        this.getData();
      })
      .catch((error) => {
        this.setState({ errorMessage: error });
      });
  }

  async blockContact() {
    return fetch(`http://localhost:3333/api/1.0.0/user/${this.state.blockContactID}/block`, {
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
          const err = 'You cannot block yourself!';
          throw err;
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
      .then(() => {
        this.setState({
          isLoading: false,
          errorMessage: 'Contact Blocked',
        });
        this.getData();
      })
      .catch((error) => {
        this.setState({ errorMessage: error });
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
              <View style={{
                display: 'flex', justifyContent: 'center', flexDirection: 'row',
              }}
              >
                <TouchableOpacity
                  onPress={() => this.deleteContactHandler(item.user_id)}
                >
                  <Ionicons name="person-remove-outline" size="large" />
                </TouchableOpacity>
                <br />
                <TouchableOpacity
                  onPress={() => this.blockContactHandler(item.user_id)}
                >
                  <Ionicons name="eye-off-outline" size="large" />
                </TouchableOpacity>
              </View>
            </ListItem>
          )}
          keyExtractor={({ userId }) => userId}
        />
      </View>
    );
  }
}

export default Contacts;

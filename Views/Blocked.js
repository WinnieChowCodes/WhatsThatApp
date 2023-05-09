/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ListItem } from '@rneui/themed';
import { Avatar } from '@rneui/base';

class Blocked extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contactsListData: [],
      blockedID: 0,
      error: '',
    };
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
    return fetch('http://localhost:3333/api/1.0.0/blocked', {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then(async (response) => {
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
      .catch((err) => {
        this.setState({ error: err });
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
      .then((response) => {
        if (response.status === 200) {
          return;
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
          error: 'Contact Unblocked',
        });
        this.getData();
      })
      .catch((err) => {
        this.setState({ error: err });
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
                  onPress={() => this.unblockContactHandler(item.user_id)}
                >
                  <Ionicons name="eye-outline" size="large" />
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

export default Blocked;

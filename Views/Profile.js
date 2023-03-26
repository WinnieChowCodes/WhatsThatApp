/* eslint-disable global-require */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRequest } from './utils/API/Get';

class Profile extends Component {
  styles = StyleSheet.create({
    profileContainer: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-around',
      flexDirection: 'column',
      alignItems: 'center',
    },
    usernameText: {
      fontSize: 25,
      textAlign: 'center',
    },
    buttonStyle: {
      backgroundColor: '#3a75b5',
      padding: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    imageStyle: {
      width: 150,
      height: 150,
      borderRadius: '50%',
    },

  });

  constructor(props) {
    super(props);
    this.state = {
      userListData: [],
      userID: 0,
      sessionToken: '',
      profilePhoto: [],
    };

    this.logout = this.logout.bind(this);
  }

  // Executes as soon as the component renders
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getUser();
      this.getProfilePic();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  // Gets the userID from the local storage and stores the value as a state
  async getUser() {
    this.setState({ userID: await AsyncStorage.getItem('userID') });
    this.setState({ sessionToken: await AsyncStorage.getItem('sessionToken') });
    getRequest(
      `http://localhost:3333/api/1.0.0/user/${await AsyncStorage.getItem('userID')}`,
      ((resJson) => {
        this.setState({
          userListData: resJson,
        }),
        (status) => {
          console.log(status);
        };
      }),
    );
  }

  async getProfilePic() {
    this.setState({ userID: await AsyncStorage.getItem('userID') });
    this.setState({ sessionToken: await AsyncStorage.getItem('sessionToken') });
    return fetch(`http://localhost:3333/api/1.0.0/user/${await AsyncStorage.getItem('userID')}/photo`, {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then((result) => result.blob())
      .then((resBlob) => {
        this.setState({
          isLoading: false,
          profilePhoto: window.URL.createObjectURL(resBlob),
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // function to log the user out
  async logout() {
    return fetch('http://localhost:3333/api/1.0.0/logout', {
      method: 'post',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
      },
    })
      .then(() => {
        this.setState({
          isLoading: false,
        });
      })
    // Clear all session tokens from local storage and return the user to the login page
      .then(async () => {
        this.props.navigation.navigate('Login');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={this.styles.profileContainer}>
        {/* Loading user profile picture using library */}
        <View>
          <Image source={{ uri: this.state.profilePhoto }} style={this.styles.imageStyle} />
          <Text style={this.styles.usernameText}>
            {this.state.userListData.first_name}
            {' '}
            {this.state.userListData.last_name}
          </Text>
          <View>
            <TouchableOpacity style={this.styles.buttonStyle}>
              <Text style={this.styles.buttonText}>Edit Profile Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.styles.buttonStyle} onPress={() => this.props.navigation.navigate('EditProfile')}>
              <Text style={this.styles.buttonText}>Edit User Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.styles.buttonStyle} onPress={this.logout}>
              <Text style={this.styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Profile;

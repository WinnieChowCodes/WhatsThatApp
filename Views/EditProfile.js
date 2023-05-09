/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as EmailValidator from 'email-validator';

class EditProfile extends Component {
  styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 25,
    },
    error: {
      color: 'red',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 5,
    },
    formFields: {
      backgroundColor: '#dadfeb',
      margin: 5,
      padding: 10,
      borderRadius: '20px',
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
      color: 'white',
      fontWeight: 'bold',
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      userData: {},
      userID: 0,
      sessionToken: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '',
    };

    this.patchData = this.patchData.bind(this);
  }

  componentDidMount() {
    this.getData();
  }

  // Gets the user data and stores it in a state
  async getData() {
    return fetch(`http://localhost:3333/api/1.0.0/user/${await AsyncStorage.getItem('userID')}`, {
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
          userData: responseJson,
        }, () => {
          this.populateForm();
        });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  // Data handlers
  firstNameHandler = (fname) => {
    this.setState({ firstName: fname });
  };

  lastNameHandler = (lname) => {
    this.setState({ lastName: lname });
  };

  emailHandler = (email) => {
    this.setState({ email });
    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: 'Not a valid Email' });
    } else {
      this.setState({ error: '' });
    }
  };

  async patchData() {
    const toSend = {};
    // Compares the current state of the data to the original data
    if (this.state.firstName !== this.state.userData.first_name) {
      toSend.first_name = this.state.firstName;
    }
    if (this.state.lastName !== this.state.userData.last_name) {
      toSend.last_name = this.state.lastName;
    }
    if (this.state.email !== this.state.userData.email) {
      toSend.email = this.state.email;
    }

    return fetch(`http://localhost:3333/api/1.0.0/user/${await AsyncStorage.getItem('userID')}`, {
      method: 'PATCH',
      headers: {
        'x-authorization': await AsyncStorage.getItem('SessionToken'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toSend),
    })
      .then((response) => {
        if (response.status === 200) {
          return;
        }
        if (response.status === 400) {
          const err = 'Something Went Wrong! Please check your fields!';
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
          error: 'Data Successfully updated!',
        });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  // Pre-populates the form
  populateForm() {
    const newFirstName = this.state.userData.first_name;
    const newLastName = this.state.userData.last_name;
    const newEmail = this.state.userData.email;
    this.setState({ firstName: newFirstName });
    this.setState({ lastName: newLastName });
    this.setState({ email: newEmail, isLoading: false });
  }

  render() {
    if (this.state.isLoading) {
      return <Text>Loading</Text>;
    }
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.title}>Edit Profile Details</Text>
        <TextInput style={this.styles.formFields} placeholder="First Name..." onChangeText={this.firstNameHandler} value={this.state.firstName} />
        <TextInput style={this.styles.formFields} placeholder="Last Name..." onChangeText={this.lastNameHandler} value={this.state.lastName} />
        <TextInput style={this.styles.formFields} placeholder="Email..." onChangeText={this.emailHandler} value={this.state.email} />
        <TouchableOpacity style={this.styles.button} onPress={this.patchData}>
          <Text style={this.styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <Text>{this.state.error}</Text>
      </View>
    );
  }
}

export default EditProfile;

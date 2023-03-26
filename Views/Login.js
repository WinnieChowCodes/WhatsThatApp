/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Text, TextInput, View, StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-web';

class Login extends Component {
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
      backgroundColor: '#3a75b5',
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
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
      email: 'AdminTest@email.com',
      password: 'AdminTest@123',
      error: '', // Stores the appropriate error
      responseData: [],
    };
    // Binds the function 'this' and the component 'this'
    this.login = this.login.bind(this);
  }

  // Whenever the user is on the login page, clear all session tokens
  async componentDidMount() {
    await AsyncStorage.removeItem('SessionToken');
    await AsyncStorage.removeItem('userID');
  }

  emailHandler = (email) => {
    // Email validation goes here
    this.setState({ email });
  };

  passwordHandler = (pass) => {
    this.setState({ password: pass });
  };

  login = () => {
    const item = this.state;
    // Resets the error state whenever we submit the form
    this.setState({ error: '' });
    console.log(item.email);
    // Validation
    if (!(item.email && item.password)) {
      this.setState({ error: 'All Fields must be filled' });
    } else {
      this.loginUser();
    }
  };

  loginUser() {
    const item = this.state;
    const data = {
      email: item.email,
      password: item.password,
    };
    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          responseData: responseJson,
        });
        if (responseJson.status === 400) {
          this.setState({ error: 'Incorrect Email/Password' });
        } else {
          this.setState({ error: 'Logged in' });
          this.props.navigation.navigate('Home');
        }
      })
      .then(async () => {
        try {
          await AsyncStorage.setItem('userID', this.state.responseData.id);
          await AsyncStorage.setItem('SessionToken', this.state.responseData.token);

          // navigate user to main page
        } catch {
          throw new Error('Something went wrong!');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={this.styles.container}>
        <Text style={this.styles.title}>Login</Text>
        <br />
        <TextInput style={this.styles.formFields} placeholder="email..." onChangeText={this.emailHandler} value={this.state.email} />
        <TextInput style={this.styles.formFields} placeholder="password" onChangeText={this.passwordHandler} value={this.state.password} secureTextEntry="true" />
        <br />
        <TouchableOpacity onPress={this.login} style={this.styles.button}>
          <Text style={this.styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={this.styles.error}>{this.state.error}</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')} style={this.styles.button}>
          <Text style={this.styles.buttonText}>Join Us</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default Login;

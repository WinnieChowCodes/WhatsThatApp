/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import {
  Text, TextInput, View, Button, StyleSheet,
} from 'react-native';
import * as EmailValidator from 'email-validator';

class Register extends Component {
  styles = StyleSheet.create({
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
      placeholderTextColor: '#8186a3',
    },

    formContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },

  });

  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
      error: '', // Stores the appropriate error
    };

    // Binds the function 'this' and the component 'this'
    this.register = this.register.bind(this);
  }

  firstNameHandler = (fName) => {
    this.setState({ firstName: fName });
  };

  lastNameHandler = (lName) => {
    this.setState({ lastName: lName });
  };

  emailHandler = (email) => {
    // Email validation goes here
    this.setState({ email });
    this.setState({ emailError: '' });

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ emailError: 'Not a valid Email' });
    } else {
      this.setState({ emailError: '' });
    }
  };

  passwordHandler = (pass) => {
    this.setState({ password: pass });
    // Password validation goes here
    const pattern = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$/;
    const passwordRegEx = new RegExp(pattern);
    if (!(passwordRegEx.test(this.state.password))) {
      this.setState({ passwordError: 'Password should have: At least 1 capital letter, at least 1 lowecase letter, At least 1 number, at least 1 special character and should be at least 8 characters long' });
      // Adm!n#123
    } else {
      this.setState({ passwordError: '' });
    }
  };

  confirmPasswordHandler = (conPass) => {
    this.setState({ confirmPassword: conPass });
  };

  register = () => {
    // Resets the error state whenever we submit the form
    this.setState({ error: '' });
    // Validation
    if (!(this.state.firstName && this.state.lastName && this.state.email && this.state.password)) {
      this.setState({ error: 'All Fields must be filled' });
      return;
    }
    if ((this.state.emailError && this.state.passwordError && this.state.confirmPasswordError)) {
      this.setState({ error: 'Email or Password is invalid' });
      return;
    }
    // Determines if the password field and the confirm password field are the same
    if (this.state.confirmPassword !== this.state.password) {
      this.setState({ error: 'Passwords do not match' });
    } else {
      // API code goes here
      this.setState({ error: '' });
      this.registerUser();
    }
  };

  registerUser = () => {
    const data = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };
    fetch('http://localhost:3333/api/1.0.0/user', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 400) {
          this.setState({ error: 'Bad Request! Please check the form' });
        } else {
          this.setState({ error: 'New user Added!' });
          this.props.navigation.navigate('Login');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <View>
        <Text style={this.styles.title}>Register</Text>
        <br />
        <View style={this.styles.formContainer}>
          <TextInput style={this.styles.formFields} placeholder="First Name" onChangeText={this.firstNameHandler} value={this.state.firstName} />
          <TextInput style={this.styles.formFields} placeholder="Last Name" onChangeText={this.lastNameHandler} value={this.state.lastName} />
          <TextInput style={this.styles.formFields} placeholder="Email" onChangeText={this.emailHandler} value={this.state.email} />
          <Text style={this.styles.error}>{this.state.emailError}</Text>
          <TextInput style={this.styles.formFields} placeholder="Password" onChangeText={this.passwordHandler} value={this.state.password} secureTextEntry="true" />
          <Text style={this.styles.error}>{this.state.passwordError}</Text>
          <TextInput style={this.styles.formFields} placeholder="Confirm Password" onChangeText={this.confirmPasswordHandler} value={this.state.confirmPassword} secureTextEntry="true" />
          <Text style={this.styles.error}>{this.state.confirmPasswordError}</Text>
        </View>
        <br />
        <Button title="Register" onPress={this.register} />
        <Text style={this.styles.error}>{this.state.error}</Text>
        <Button title="Back" onPress={() => this.props.navigation.goBack(null)} />
      </View>
    );
  }
}

export default Register;

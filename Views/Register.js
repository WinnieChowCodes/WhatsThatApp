import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import * as EmailValidator from 'email-validator';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      error: "", //Stores the appropriate error
      submitted: false //Determines if the user has pressed the login button - is used to prevent the user from pressing the button again as the form is being processed
    }

    //Binds the function 'this' and the component 'this'
    this.register = this.register.bind(this)
  }

  firstNameHandler = (fName) => {
    this.setState({ firstName: fName });
  }

  lastNameHandler = (lName) => {
    this.setState({ lastName: lName });
  }

  emailHandler = (email) => {
    //Email validation goes here
    this.setState({ email: email });
    this.setState({ emailError: "" });

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ emailError: "Not a valid Email" })
    }
    else {
      this.setState({ emailError: "" })
    }
  }

  passwordHandler = (pass) => {
    this.setState({ password: pass })
    //Password validation goes here
    const passwordRegEx = new RegExp("^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,30}$");
    if (!(passwordRegEx.test(this.state.password))) {
      this.setState({ passwordError: "Password should have: At least 1 capital letter, at least 1 lowecase letter, At least 1 number, at least 1 special character and should be at least 8 characters long" })
      //Adm!n#123
    }
    else {
      this.setState({ passwordError: "" })
    }
  }

  confirmPasswordHandler = (conPass) => {
    this.setState({ confirmPassword: conPass })
  }

  register = (props) => {
    this.setState({ submitted: true })
    //Resets the error state whenever we submit the form
    this.setState({ error: "" })
    //Validation
    if (!(this.state.firstName && this.state.lastName && this.state.email && this.state.password)) {
      this.setState({ error: "All Fields must be filled" })
      return;
    }
    if ((this.state.emailError && this.state.passwordError && this.state.confirmPasswordError)) {
      this.setState({ error: "Email or Password is invalid" })
      return;
    }
    //Determines if the password field and the confirm password field are the same
    if (this.state.confirmPassword != this.state.password) {
      this.setState({ error: "Passwords do not match" })
    }
    else {
      //API code goes here
      this.setState({ error: "" })
      alert("First Name: " + this.state.firstName + " Last Name: " + this.state.lastName + " Email: " + this.state.email + " Password: " + this.state.password);
    }
  }

  styles = StyleSheet.create({
    error: {
      color: 'red',
    },
    title: {
      backgroundColor: '#7ab2ff',
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      padding: 5,
    },
    formFields: {
      backgroundColor: '#dadfeb',
      placeholderTextColor: '#8186a3'
    },

    formContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },

  })

  render() {
    return (
      <View>
        <Text style={this.styles.title}>Register</Text>
        <br />
        <View style={this.styles.formContainer}>
          <TextInput style={this.styles.formFields} placeholder="First Name" onChangeText={this.firstNameHandler} value={this.state.firstName}></TextInput>
          <TextInput style={this.styles.formFields} placeholder="Last Name" onChangeText={this.lastNameHandler} value={this.state.lastName}></TextInput>
          <TextInput style={this.styles.formFields} placeholder='Email' onChangeText={this.emailHandler} value={this.state.email} />
          <Text style={this.styles.error}>{this.state.emailError}</Text>
          <TextInput style={this.styles.formFields} placeholder='Password' onChangeText={this.passwordHandler} value={this.state.password} secureTextEntry="true" />
          <Text style={this.styles.error}>{this.state.passwordError}</Text>
          <TextInput style={this.styles.formFields} placeholder='Confirm Password' onChangeText={this.confirmPasswordHandler} value={this.state.confirmPassword} secureTextEntry="true" />
          <Text style={this.styles.error}>{this.state.confirmPasswordError}</Text>
        </View>
        <br />
        <Button title="Register" onPress={this.register}></Button>
        <Text style={this.styles.error}>{this.state.error}</Text>
      </View>
    );
  }
}

export default App

import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import * as EmailValidator from 'email-validator';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError:"",
      passwordError:"",
      error: "", //Stores the appropriate error
      submitted: false //Determines if the user has pressed the login button - is used to prevent the user from pressing the button again as the form is being processed
    }

    //Binds the function 'this' and the component 'this'
    this.login = this.login.bind(this)
  }


  emailHandler = (email) => {
    //Email validation goes here
    this.setState({ email: email });
    this.setState({emailError:""});

    if(!EmailValidator.validate(this.state.email)){
      this.setState({emailError: "Not a valid Email"})
    }
    else{
      this.setState({emailError:""})
    }
  }

  passwordHandler = (pass) => {
    //Password validation goes here

    /*Password Regular Expression Conditions:
      - At least 1 lowercase character
      -at least 1 uppercase character
      - at least 1 number
      - at least 1 special character
      - at least 8 characters long
    */
    const passwordRegEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if(!(passwordRegEx.test(this.state.password))){
      this.setState({passwordError:"Not a valid Password"})
    }
    else{
      this.setState({passwordError:""})
    }
    this.setState({ password: pass })
  }

  login = (props) => {
    this.setState({ submitted: true })
    //Resets the error state whenever we submit the form
    this.setState({error: ""})
    //Validation
    if (!(this.state.email && this.state.password)) {
      this.setState({ error: "All Fields must be filled" })
      return;
    }
    if(!(!(this.state.emailError && this.state.passwordError)))
    {
      this.setState({error: "Email or Password is invalid"})
      return;
    }
    else {
      //API code goes here
      this.setState({error:""})
      alert("Email: " + this.state.email + " Password: " + this.state.password);
    }
  }

  styles = StyleSheet.create({
  error: {
    color:'red',
  },
  title: {
    backgroundColor:'#7ab2ff',
    fontSize: 20,
    fontWeight: 'bold',
    color:'white',
    textAlign: 'center',
    padding: 5,
  },
  formFields: {
    backgroundColor:'#dadfeb',
    justifyContent: 'space-around',
  }
})

  render() {
    return (
      <View>
        <Text style={this.styles.title}>Email</Text>
        <TextInput style={this.styles.formFields} placeholder='email...' onChangeText={this.emailHandler} value={this.state.email} />
        <Text style={this.styles.error}>{this.state.emailError}</Text>
        <TextInput style={this.styles.formFields} placeholder='password' onChangeText={this.passwordHandler} value={this.state.password} secureTextEntry="true" />
        <Text style={this.styles.error}>{this.state.passwordError}</Text>
        <Button title="Login" onPress={this.login}></Button>
        <Text style={this.styles.error}>{this.state.error}</Text>

        <Button title="Join Us"></Button>
      </View>
    );
  }
}

export default App

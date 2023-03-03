import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, Alert, StyleSheet } from 'react-native';
import * as EmailValidator from 'email-validator';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "AdminTest@email.com",
      password: "AdminTest@123",
      error: "", //Stores the appropriate error
      submitted: false, //Determines if the user has pressed the login button - is used to prevent the user from pressing the button again as the form is being processed
      responseData: []
    }
    //Binds the function 'this' and the component 'this'
    this.login = this.login.bind(this)
  }

  //Whenever the user is on the login page, clear all session tokens
  async componentDidMount(){
    await AsyncStorage.removeItem("SessionToken");
    await AsyncStorage.removeItem("userID");
  }

  emailHandler = (email) => {
    //Email validation goes here
    this.setState({ email: email });
  }

  passwordHandler = (pass) => {
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
    else {
      this.loginUser();
    }
  }

  loginUser(){
    //API code goes here
    let data = {
      email : this.state.email,
      password: this.state.password
    };
    fetch("http://localhost:3333/api/1.0.0/login", {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        isLoading: false,
        responseData: responseJson
      })
      if (responseJson.status == 400){
        this.setState({error:"Incorrect Email/Password"});
      }
      else{
        this.setState({error:"Logged in"});
        this.props.navigation.navigate('Home');
      }
    })
    .then(async () => {
      try{
        await AsyncStorage.setItem("userID", this.state.responseData.id)
        await AsyncStorage.setItem("SessionToken", this.state.responseData.token)
        
        this.setState({submitted:false});

        //navigate user to main page
      }catch{
        throw "Something went wrong!"
      }
    }
    )
    .catch((error) => {
      console.log(error);
    });
  }

  styles = StyleSheet.create({
  error: {
    color:'red',
  },
  title: {
    backgroundColor:'#3a75b5',
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
        <br/>
        <TextInput style={this.styles.formFields} placeholder='email...' onChangeText={this.emailHandler} value={this.state.email} />
        <TextInput style={this.styles.formFields} placeholder='password' onChangeText={this.passwordHandler} value={this.state.password} secureTextEntry="true" />
        <br/>
        <Button title="Login" onPress={this.login}></Button>
        <Text style={this.styles.error}>{this.state.error}</Text>
        <Button title="Join Us" onPress={()=> this.props.navigation.navigate('Register')}></Button>
      </View>
    );
  }
}

export default Login

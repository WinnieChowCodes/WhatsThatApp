import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      isLoading: true,
      userListData: [],
      userID: 0,
      sessionToken: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      error: ""
    }

    this.patchData = this.patchData.bind(this)
  }

  componentDidMount(){
    console.log("This is the Edit Profile Page");
    this.getUserID();
  }

  async getUserID() {
    this.setState({ userID: await AsyncStorage.getItem("userID") });
    this.setState({ sessionToken: await AsyncStorage.getItem("sessionToken") });
    this.getData();
  }

  //Gets the user data and stores it in a state
  async getData() {
    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("userID"), {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem("SessionToken")
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userListData: responseJson
        })
        this.populateForm()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async patchData(){
    let toSend = {};

    //Compares the current state of the data to the original data
    if(this.state.firstName != this.state.userListData.first_name){
      toSend['first_name'] = this.state.firstName;
    }
    if(this.state.lastName != this.state.userListData.last_name){
      toSend['last_name'] = this.state.lastName;
    }
    if(this.state.email != this.state.userListData.email){
      toSend['email'] = this.state.email;
    }

    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("userID"), {
      method: 'PATCH',
      headers: {
        'x-authorization': await AsyncStorage.getItem("SessionToken"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toSend)
    })
      .then(() => {
        this.setState({
          isLoading: false,
          error: "Data Successfully updated!"
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Pre-populates the form
  populateForm(){
    this.setState({firstName: this.state.userListData.first_name})
    this.setState({lastName: this.state.userListData.last_name})
    this.setState({email: this.state.userListData.email})
  }

  styles = StyleSheet.create({
    formContainer:{
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
    },
    error: {
      color:'red',
    },
    formFields: {
      backgroundColor:'#dadfeb',
    }
  })

  //Data handlers 
  firstNameHandler = (fname) =>{
    this.setState({firstName: fname})
  }

  lastNameHandler = (lname) => {
    this.setState({lastName: lname})
  }

  emailHandler = (email) => {
    this.setState({ email: email });
  }

  passwordHandler = (pass) => {
    this.setState({password: pass})
  }

  render() {
      return (
        <View style={this.styles.formContainer}>
          <TextInput style={this.styles.formFields} placeholder="First Name..." onChangeText={this.firstNameHandler} value={this.state.firstName} />
          <TextInput style={this.styles.formFields} placeholder="Last Name..." onChangeText={this.lastNameHandler} value={this.state.lastName} />
           <TextInput style={this.styles.formFields} placeholder="Email..." onChangeText={this.emailHandler} value={this.state.email} />
        <TextInput style={this.styles.formFields} placeholder="Password" onChangeText={this.passwordHandler} value={this.state.password} secureTextEntry="true" />
        <TouchableOpacity onPress={this.patchData}>
          <Text>Update</Text>
        </TouchableOpacity>
        <Text>{this.state.error}</Text>
        </View>
      )
  }
}

export default EditProfile

import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Name",
      userListData: [],
      userID: 0,
      sessionToken: "",
      loginState: "Logged In"
    }

    this.logout = this.logout.bind(this);
  }

  //Executes as soon as the component renders
  componentDidMount() {
    this.getUserID();
  }

  async deleteSession() {
    await AsyncStorage.removeItem("SessionToken");
    await AsyncStorage.removeItem("userID");
  }
  //Gets the userID from the local storage and stores the value as a state
  async getUserID() {
    this.setState({ userID: await AsyncStorage.getItem("userID") });
    this.setState({ sessionToken: await AsyncStorage.getItem("sessionToken") });
    this.getData();
  }

  //Performs a GET request on users
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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //function to update the profile pic
  editProfilePic = (props) => {

  }

  //function to edit profile details
  editProfile = (props) => {

  }

  //function to log the user out
  async logout() {
    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: 'post',
      headers: {
        'x-authorization': await AsyncStorage.getItem("SessionToken")
      }
    })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          loginState: "Logged Out"
        })
      })
      //Clear all session tokens from local storage and return the user to the login page
      .then(async (response) => {
        this.deleteSession();
        this.props.navigation.navigate('Login');
      }
      )
      .catch((error) => {
        console.log(error);
      });
  }

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
      textAlign: 'center'
    },
    buttonStyle: {
      backgroundColor: '#3a75b5',
      padding: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    imageStyle: {
      width: 150,
      height: 150,
      borderRadius: '50%'
    }

  })

  render() {
    return (
      <View style={this.styles.profileContainer}>
        {/*Loading user profile picture using library*/}
        <View>
          <Image source={require('./Images/default.jpeg')} style={this.styles.imageStyle} />
          <Text style={this.styles.usernameText}>{this.state.userListData.first_name} {this.state.userListData.last_name}</Text>
          <View>
            <TouchableOpacity style={this.styles.buttonStyle}>
              <Text style={this.styles.buttonText}>Edit Profile Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.styles.buttonStyle}>
              <Text style={this.styles.buttonText}>Edit User Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.styles.buttonStyle} onPress={this.logout}>
              <Text style={this.styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
          <Text>{this.state.loginState}</Text>
        </View>
      </View>
    );
  }
}

export default Profile

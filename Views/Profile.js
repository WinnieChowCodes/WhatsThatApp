import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image } from 'react-native';
import ProfilePicture from 'react-native-profile-picture';
import { TouchableOpacity } from 'react-native-web';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "Name",
      profilePic: ""
    }
  }

  //function to update the profile pic
  editProfilePic = (props) => {

  }

  //function to edit profile details
  editProfile = (props) => {

  }

  //function to log the user out
  logout = (props) => {

  }
  styles = StyleSheet.create({
    profileContainer: {
      display: 'flex',
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
    }

  })

  render() {
    return (
      <View>
        {/*Loading user profile picture using library*/}
        <div style={this.styles.profileContainer}>
          <ProfilePicture
            isPicture={true}
            requirePicture="https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"
            shape='circle'
            width={150}
            height={150}
            style={{ alignSelf: 'center' }}
          />
          <Text style={this.styles.usernameText}>{this.state.username}</Text>
          <div>
            <TouchableOpacity style={this.styles.buttonStyle}>
              <Text style={this.styles.buttonText}>Edit Profile Picture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.styles.buttonStyle}>
              <Text style={this.styles.buttonText}>Edit User Details</Text>
            </TouchableOpacity>
            <br/>
            <TouchableOpacity style={this.styles.buttonStyle}>
              <Text style={this.styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </div>
        </div>
      </View>
    );
  }
}

export default App

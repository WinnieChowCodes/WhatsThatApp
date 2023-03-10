import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';
class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      isLoading: true,
      contactsListData: [],
      deleteContactID: 0,
      blockContactID: 0,
      errorMessage: ""
    }
  }

  componentDidMount() {
    this.getData();
  };

  async getData() {
    return fetch("http://localhost:3333/api/1.0.0/contacts", {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem("SessionToken")
      }
    })
    .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          contactsListData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async deleteContact(){
    return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.deleteContactID+"/contact", {
      method: 'delete',
      headers: {
        'x-authorization': await AsyncStorage.getItem("SessionToken")
      }
    })
      .then(() => {
        this.setState({
          isLoading: false,
          errorMessage: "Contact Removed"
        })
        console.log("Contact Removed")
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async blockContact(){
    return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.blockContactID+"/block", {
      method: 'post',
      headers: {
        'x-authorization': await AsyncStorage.getItem("SessionToken")
      }
    })
      .then(() => {
        this.setState({
          isLoading: false,
          errorMessage: "Contact Blocked"
        })
        console.log("Contact Blocked")
        this.getData();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteContactHandler = (ID) => {
    this.setState({
      isLoading: true,
      deleteContactID: ID
    }, () => {
      this.deleteContact();
    });
  }

  blockContactHandler = (ID) => {
    this.setState({
      isLoading: true,
      blockContactID: ID
    }, () => {
      this.blockContact();
    });
  }

  styles = StyleSheet.create({
    header:{
      backgroundColor: '#3a75b5',
      padding: 10,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20
    },
    search: {
      placeholderTextColor: 'gray',
      backgroundColor: '#e8e5e3'
    },
    userButton: {
      backgroundColor: '#3a75b5',
      padding: 10,
      width: 100
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    userContainer:{
      display: 'flex',
      justifyContent: "flex-start",
      flexDirection: 'row',
      flexWrap: 'wrap'
    }
  })
  render() {
    if (this.state.isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }
    if(this.state.contactsListData.length ==0){
      return(
        <View>
           <Text>No Current Contacts!</Text>
        </View>
      )
    }
    else {
      return (
        <View>
          <Text>{this.state.errorMessage}</Text>
          <FlatList
            data={this.state.contactsListData}
            renderItem={({ item }) => (
              <View>
                <br/>
                <View>
                  <Text>{item.first_name} {item.last_name}</Text>
                  <Text>{item.email}</Text>
                </View>
                <View>
                  <TouchableOpacity style={this.styles.userButton} onPress={()=>this.deleteContactHandler(item.user_id)}>
                    <Text style={this.styles.buttonText}>Remove Contact</Text>
                  </TouchableOpacity>
                  <br/>
                  <TouchableOpacity style={this.styles.userButton} onPress={()=>this.blockContactHandler(item.user_id)}>
                    <Text style={this.styles.buttonText}>Block User</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={({ user_id }, index) => user_id} />
        </View>
      )
    }
  }
}

export default Contacts

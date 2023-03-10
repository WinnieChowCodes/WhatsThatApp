import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      isLoading: true,
      usersListData: [],
      contactID: 0,
      contactMessage: ""
    }
    this.addContact = this.addContact.bind(this)
  }

  componentDidMount() {
    this.getData();
  };

  async getData() {
    return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.query, {
      method: 'get',
      headers: {
        'x-authorization': await AsyncStorage.getItem("SessionToken")
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          usersListData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //Performs a POST request to add a new contact
  async addContact() {
    return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.contactID + "/contact", {
      method: 'post',
      headers: {
        'x-authorization': await AsyncStorage.getItem("SessionToken")
      }
    })
      .then(() => {
        this.setState({
          isLoading: false,
          contactMessage: "User added to Contacts"
        })
        return(<Text style={this.styles.contactSuccessMessage}>{this.state.contactMessage}</Text>);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addContactHandler = (ID) => {
    this.setState({
      isLoading: true,
      contactID: ID
    }, () => {
      this.addContact();
    });
    
    //this.addContact();
  }

  //Stores the value of the query in the relevant state
  searchHandler = (newQuery) => {
    this.setState({ query: newQuery });
    console.log(this.state.query);
  }

  //Performs a search of users
  searchUsers = () => {
    this.setState({ isLoading: false });
    this.getData();
  }

  styles = StyleSheet.create({
    ViewContainer: {
      display: 'flex',
      flex: 1,
    },
    header: {
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
    userContainer: {
      display: 'flex',
      justifyContent: "flex-start",
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    contactSuccessMessage: {
      backgroundColor: '#3ae07a',
      padding: 10,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center'
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
    else {
      return (
        <View style={this.styles.ViewContainer}>
          <TextInput placeholder='Search...' style={this.styles.search} onChangeText={this.searchHandler} value={this.state.query}></TextInput>
          <Button title="Search" onPress={this.searchUsers}></Button>
          <FlatList
            data={this.state.usersListData}
            renderItem={({ item }) => (
              <View>
                <br />
                <View>
                  <Text>{item.given_name} {item.family_name}</Text>
                  <Text>{item.email}</Text>
                </View>
                <View>
                  <TouchableOpacity style={this.styles.userButton} onPress={()=>this.addContactHandler(item.user_id)}>
                    <Text style={this.styles.buttonText}>Add To Contacts</Text>
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

export default Users

import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      isLoading: true,
      contactsListData: [],
    }
  }

  componentDidMount() {
    this.getData();
  };

  getData() {
    return fetch("http://localhost:3333/api/1.0.0/contacts", {
      method: 'get',
      headers: {
        'x-authorization': '3313ab47c37376f7e67d5e2af486483a'
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
           <Text style={this.styles.header}>Contacts</Text>
           <Text>No Current Contacts!</Text>
        </View>
      )
    }
    else {
      return (
        <View>
          <Text style={this.styles.header}>Contacts</Text>
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
                  <TouchableOpacity style={this.styles.userButton}>
                    <Text style={this.styles.buttonText}>Remove Contact</Text>
                  </TouchableOpacity>
                  <br/>
                  <TouchableOpacity style={this.styles.userButton}>
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

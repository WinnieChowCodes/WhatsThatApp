import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      isLoading: true,
      usersListData: [],
    }
  }

  componentDidMount() {
    this.getData();
  };

  getData() {
    return fetch(this.searchQueryURLFormatter(), {
      method: 'get',
      headers: {
        'x-authorization': '3313ab47c37376f7e67d5e2af486483a'
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

  //Formats the URL
  searchQueryURLFormatter=()=>{
    return("http://localhost:3333/api/1.0.0/search?q="+this.state.query)
  }

  //Stores the value of the query in the relevant state
  searchHandler=(newQuery)=>{
    this.setState({query: newQuery});
    console.log(this.state.query);
  }

  //Performs a search of users
  searchUsers=()=>{
    this.setState({isLoading:false});
    this.getData();
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
    else {
      return (
        <View>
          <Text style={this.styles.header}>Users</Text>
          <TextInput placeholder='Search...' style={this.styles.search} onChangeText={this.searchHandler} value={this.state.query}></TextInput>
          <Button title="Search" onPress={this.searchUsers}></Button>
          <FlatList
            data={this.state.usersListData}
            renderItem={({ item }) => (
              <View>
                <br/>
                <View>
                  <Text>{item.given_name} {item.family_name}</Text>
                  <Text>{item.email}</Text>
                </View>
                <View>
                  <TouchableOpacity style={this.styles.userButton}>
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

export default App

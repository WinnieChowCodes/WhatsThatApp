/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-web';
import { ListItem } from '@rneui/base';
import Ionicons from 'react-native-vector-icons/Ionicons';

class Drafts extends Component {
  styles = StyleSheet.create({
  });

  constructor(props) {
    super(props);

    this.state = {
      allDrafts: [],
    };
  }

  // Executes as soon as the component renders
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({ allDrafts: JSON.parse(await AsyncStorage.getItem('drafts')) });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  updateDraft = (ID) => {
    console.log(ID);
  };

  deleteDraft = (ID) => {
    console.log(ID);
  };

  render() {
    return (
      <View style={this.styles.container}>
        <Text style={{fontSize: 20}}>Drafts</Text>
        <FlatList
          data={this.state.allDrafts}
          renderItem={({ item }) => (
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title>{item.message}</ListItem.Title>
                <ListItem.Subtitle>
                  Date To Post:
                  {' '}
                  {item.dateToPost}
                </ListItem.Subtitle>
              </ListItem.Content>
              <TouchableOpacity
                onPress={() => this.updateDraft(item.messageID)}
              >
                <Ionicons name="create-outline" size="large" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.deleteDraft(item.messageID)}
              >
                <Ionicons name="trash-outline" size="large" />
              </TouchableOpacity>
            </ListItem>
          )}
          keyExtractor={({ chatId }) => chatId}
        />
      </View>
    );
  }
}

export default Drafts;

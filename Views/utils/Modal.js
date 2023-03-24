import React, { Component, StrictMode } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Image, Modal } from 'react-native';
import { ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ModalClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            chatTitle: "",
        }
        this.newChat = this.newChat.bind(this)
    }

    async getData() {
        return fetch("http://localhost:3333/api/1.0.0/chat", {
          method: 'get',
          headers: {
            'x-authorization': await AsyncStorage.getItem("SessionToken")
          }
        }) 
        .then((response) => response.json())
          .then((responseJson) => {
            this.setState({
              isLoading: false,
              chatsListData: responseJson
            })
          })
          .catch((error) => {
            console.log(error);
          });
      }

    //Creates a new chat
    async newChat() {
        let data = { name: this.state.chatTitle };
        return fetch("http://localhost:3333/api/1.0.0/chat", {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                'X-Authorization': await AsyncStorage.getItem("SessionToken")
            },
            body: JSON.stringify(data)
        })
        .then(()=>{
            this.setState({modalVisible: false});
        })
        .catch((error) => {
            console.log(error);
        });
    }

    chatTitleHandler = (title) => {
        this.setState({ chatTitle: title })
    }

    styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
        },
        modalView: {
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 35,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        button: {
            borderRadius: 20,
            padding: 10,
            elevation: 2,
        },
        buttonClose: {
            backgroundColor: '#2196F3',
        },
        textStyle: {
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
        },
        modalText: {
            marginBottom: 15,
            textAlign: 'center',
        },
    }
    )
    render() {
        const { modalVisible } = this.state;
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        this.setState({ modalVisible: !modalVisible });
                    }}>
                    <View style={this.styles.centeredView}>
                        <View style={this.styles.modalView}>
                            <TextInput placeholder='Chat Title' onChangeText={this.chatTitleHandler} value={this.state.chatTitle}></TextInput>
                            <TouchableOpacity style={[this.styles.button, this.styles.buttonClose]} onPress={() => this.setState({ modalVisible: !modalVisible })}>
                                <Text style={this.styles.textStyle}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[this.styles.button, this.styles.buttonClose]} onPress={this.newChat}>
                                <Text style={this.styles.textStyle}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <TouchableOpacity style={[this.styles.button, this.styles.buttonClose]} onPress={() => this.setState({ modalVisible: true })}>
                    <Text style={this.styles.textStyle}>New Chat</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default ModalClass
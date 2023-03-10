import * as React from 'react';
import { Component } from "react";
import { View } from 'react-native-web';

//Navigation imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//Pages
import LoginPage from './Views/Login';
import RegisterPage from './Views/Register';
import ProfilePage from './Views/Profile';
import UsersPage from './Views/Users';
import ContactsPage from './Views/Contacts';
import BlockedPage from './Views/Blocked';
import ChatListPage from './Views/ChatList';
import EditProfilePage from './Views/EditProfile';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();


function ProfStack(){
  return (
  <ProfileStack.Navigator initialRouteName='ProfileMain' screenOptions={{headerShown: false}}>
    <ProfileStack.Screen name="ProfileMain" component={ProfilePage}/>
    <ProfileStack.Screen name="EditProfile" component={EditProfilePage}/>
  </ProfileStack.Navigator>
  );
}

function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfStack} />
      <Tab.Screen name="Users" component={UsersPage} />
      <Tab.Screen name="Chats" component={ChatListPage} />
      <Tab.Screen name="Contact" component={ContactsPage} />
      <Tab.Screen name="Blocked" component={BlockedPage} />
    </Tab.Navigator>
  );
}



class App extends Component {

  render() {
    return (
      <NavigationContainer>
        <AuthStack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
          <AuthStack.Screen name="Login" component={LoginPage} />
          <AuthStack.Screen name="Register" component={RegisterPage} />
          <AuthStack.Screen name="Home" component={TabNavigation} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App

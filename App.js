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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={ProfilePage} />
      <Tab.Screen name="Users" component={UsersPage} />
    </Tab.Navigator>
  );
}

class App extends Component {

  render() {
    return (
      <View>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Register" component={RegisterPage} />
            <Stack.Screen name="Home" component={TabNavigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

export default App

/* eslint-disable linebreak-style */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginPage from './Views/Login';
import RegisterPage from './Views/Register';
import ProfilePage from './Views/Profile';
import UsersPage from './Views/Users';
import ContactsPage from './Views/Contacts';
import BlockedPage from './Views/Blocked';
import ChatListPage from './Views/ChatList';
import EditProfilePage from './Views/EditProfile';
import ChatPage from './Views/Chat';
import EditChatPage from './Views/EditChat';
import EditChatUsers from './Views/EditChatUsers';
import EditMessagePage from './Views/EditMessage';
import DraftsPage from './Views/Drafts';

const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();
const ChatsStack = createNativeStackNavigator();

// function which returns a stack navigation for the profile pages
function ProfStack() {
  return (
    <ProfileStack.Navigator initialRouteName="ProfileMain" screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfilePage} />
      <ProfileStack.Screen name="EditProfile" component={EditProfilePage} />
    </ProfileStack.Navigator>
  );
}

function ChatsStackFunc() {
  return (
    <ChatsStack.Navigator initialRouteName="ChatMain" screenOptions={{ headerShown: false }}>
      <ChatsStack.Screen name="ChatMain" component={ChatListPage} />
      <ChatsStack.Screen name="Chat" component={ChatPage} />
      <ChatsStack.Screen name="EditChat" component={EditChatPage} />
      <ChatsStack.Screen name="EditChatUsers" component={EditChatUsers} />
      <ChatsStack.Screen name="EditMessage" component={EditMessagePage} />
      <ChatsStack.Screen name="Drafts" component={DraftsPage} />
    </ChatsStack.Navigator>
  );
}

function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          }
          if (route.name === 'Chats') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          }
          if (route.name === 'Contact') {
            iconName = focused ? 'list' : 'list-outline';
          }
          if (route.name === 'Blocked') {
            iconName = focused ? 'notifications-off' : 'notifications-off-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Profile" component={ProfStack} />
      <Tab.Screen name="Users" component={UsersPage} />
      <Tab.Screen name="Chats" options={{ headerShown: false }} component={ChatsStackFunc} />
      <Tab.Screen name="Contact" component={ContactsPage} />
      <Tab.Screen name="Blocked" component={BlockedPage} />
    </Tab.Navigator>
  );
}

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginPage} />
          <AuthStack.Screen name="Register" component={RegisterPage} />
          <AuthStack.Screen name="Home" component={TabNavigation} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;

/* eslint-disable import/prefer-default-export */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getRequest = async (url, success, failure) => fetch(url, {
  method: 'get',
  headers: {
    'x-authorization': await AsyncStorage.getItem('SessionToken'),
  },
})
  .then((response) => {
    if (response.status === 200) {
      return response.json();
    }
    if (response.status === 400) {
      const err = 'Something Went Wrong! Please check your fields!';
      throw err;
    }
    if (response.status === 401) {
      // User is unauthorised - return to login screen
      this.props.navigation.navigate('Login');
    }
    if (response.status === 403) {
      const err = 'You do not have the correct permissions to perform this action!';
      throw err;
    }
    if (response.status === 404) {
      const err = '404 not found';
      throw err;
    } else {
      const err = 'Server Error! Please try again later!';
      throw err;
    }
  })
  .then((resJson) => {
    success(resJson);
  })
  .catch((error) => {
    failure(error);
  });

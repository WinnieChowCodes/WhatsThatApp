
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getRequest = async (url, success, failure) => {
    return fetch(url, {
        method: 'get',
        headers: {
            'x-authorization': await AsyncStorage.getItem("SessionToken")
        }
    })
        .then((response) => {
            if (response.status == 200) {
                return response.json();
            }
            else{
                throw response.status;
            }
        })
        .then((resJson)=>{
            success(resJson)
        })
        .catch((error) => {
            failure(err)
        });
}

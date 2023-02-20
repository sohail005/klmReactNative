import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import uuid from 'react-native-uuid';
const generateGuid = uuid.v4();
const instance = axios.create({

  //baseURL: "https://klmapidev.revalweb.com/",
   baseURL: "https://klmapi.revalweb.com/",

  // baseURL: "https://klmapidev.revalweb.com/",

  headers: {
    'Content-Type': 'application/json'
    // 'authorization': 'Bearer '
  }
});

// instance.interceptors.response.use(async (response) => {
//   // console.log(response,'interceptor response');
// },(error) => {
//   return Promise.reject(error);
// })

instance.interceptors.request.use(async (config) => {
  let jwt = await _getData('JwtToken') || '';
  let CurrencyId = await _getData('CurrencyId') || '1';
  let CustomerToken = await _getData('CustomerToken') || '';
  let LanguageId = await _getData('LanguageId') || '1';
  let SessionID = generateGuid
  if (jwt != null && jwt != undefined && jwt !== '') {
    // console.log(CurrencyId,'helper');
    var decoded = jwtDecode(jwt);
    const date = new Date();
    if (date.valueOf().toString().slice(0, date.valueOf().toString().length - 3) >= decoded.exp) {
      jwt = '';
    }
  }

  if (config.url == '/api/JwtToken') {
    return config;
  }
  else {
    if (!config.url.includes('InsertFranchisee')) {
      if (config.method.toLowerCase() == 'post') {

        config.data.CurrencyId = CurrencyId;
        config.data.CustomerToken = CustomerToken;
        config.data.LanguageId = LanguageId;

      } else {
        if (!config.url.includes('getCurrency') && !config.url.includes('mylocation')) {
          if (config.url.includes('?')) {
            config.url = config.url + '&cid=' + CurrencyId + '&lid=' + LanguageId + '&ctkn=' + CustomerToken;
          } else {
            config.url = config.url + '?cid=' + CurrencyId + '&lid=' + LanguageId + '&ctkn=' + CustomerToken;
          }

        }

      }

    }

    if (jwt == '') {
      // return  axios.post('https://klmapidev.revalweb.com/api/JwtToken', { 
        return  axios.post('https://klmapi.revalweb.com/api/JwtToken', {
     // return axios.post('https://klmapidev.revalweb.com/api/JwtToken', {
        SessionID: SessionID,
        SiteURL: "https://revaldemo2020uidev.revalweb.com"
      }).then((response) => {

        let retrundata = response.data;
        _storeData('JwtToken', retrundata.SecurityToken);
        AsyncStorage.setItem('SessionID', generateGuid);
        config.headers.authorization = 'Bearer ' + retrundata.SecurityToken
        return config;

      });
    }
    else {
      config.headers.authorization = 'Bearer ' + jwt;
      return config;
    }

  }

}, (error) => {
  console.log(error)
  return Promise.reject(error);
});

export default {
  getData: (actionUrl) => instance({
    method: 'GET',
    url: actionUrl,
    transformResponse: [function (data) {
      const json = JSON.parse(data)
      if (json.ReturnCode == 108) {
        AsyncStorage.removeItem('BasketGuid');
        AsyncStorage.removeItem('CartCount');
        // AsyncStorage.removeItem('CountryId');
        AsyncStorage.removeItem('CustomerStatusId');
        AsyncStorage.removeItem('CustomerToken');
        AsyncStorage.removeItem('CustomerUniqueId');
        AsyncStorage.removeItem('UserEmail');
        AsyncStorage.removeItem('FirstName');
        AsyncStorage.removeItem('IsExistingCustomer');
        this.props.navigation.navigate('Home');
      }
      if (json.ReturnCode == 12) {
        AsyncStorage.removeItem('JwtToken');
      }
      return json;
    }]
  }).catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('200 status')
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);

    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
  }),
  postData: (actionUrl, requestData) =>
    instance({
      method: 'POST',
      url: actionUrl,
      data: requestData,
      // transformRequest: [function (data) {
      //   debugger;
      //   // data.CurrencyId = 1;
      //   // data.CustomerToken = '';
      //   // data.LanguageId = 1;
      //   //// console.log('Post Transform request');
      //   //// console.log(data);
      //   return data;
      // }],
      transformResponse: [function (data) {
        const json = JSON.parse(data)
        if (json.ReturnCode == 108) {
          AsyncStorage.removeItem('BasketGuid');
          AsyncStorage.removeItem('CartCount');
          AsyncStorage.removeItem('CountryId');
          AsyncStorage.removeItem('CustomerStatusId');
          AsyncStorage.removeItem('CustomerToken');
          AsyncStorage.removeItem('CustomerUniqueId');
          AsyncStorage.removeItem('UserEmail');
          AsyncStorage.removeItem('FirstName');
          AsyncStorage.removeItem('IsExistingCustomer');
          this.props.navigation.navigate('Home');
        }
        if (json.ReturnCode == 12) {
          AsyncStorage.removeItem('JwtToken');
        }
        return json;
      }]
    }).catch(function (error) {
      console.log(error);
    })

}

const _storeData = async (key, value) => {

  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
  }
}

const _getData = async (key) => {
  let userId = '';
  try {
    userId = await AsyncStorage.getItem(key);
  } catch (error) {
    // Error retrieving data
    // console.log(error.message);
  }
  return userId;
}
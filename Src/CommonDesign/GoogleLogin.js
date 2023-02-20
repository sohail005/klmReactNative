// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import cryptoJS from 'react-native-crypto-js';
// import api from '../Helper/helperModule';
// import { getGlobalVarsF, setGlobalVarsF } from '../Helper/loginhelper';
// import { getCartGlobalVarsF, setCartGlobalVarsF } from '../Helper/cartcounthelper';
// import InformationPopup from '../CommonDesign/InformationPopup'
// import AsyncStorage from '@react-native-async-storage/async-storage';
// const w = Dimensions.get('screen').width;
// const h = Dimensions.get('screen').height;
// GoogleSignin.configure({
//     webClientId: '750517906591-707f0l31o5358a7q7rf5uc5dt5cnvdpu.apps.googleusercontent.com',
//     androidClientId: '750517906591-o95ldec8uerej9m8o88rjfcvun0v622a.apps.googleusercontent.com',
//     //iosClientId: '513565708095-3gmqkc3rn92v9s4hv907q3gghnh07j4f.apps.googleusercontent.com',
//     offlineAccess: true,
//     // forceCodeForRefreshToken: true,
// })

// const GoogleLogin = ({ navigation, From }) => {

//     const [responseMessage, setResponseMessage] = useState('');

//     const signIn = async () => {
//         try {
//             let CartGuid = await AsyncStorage.getItem('BasketGuid');
//             let SessionID = await AsyncStorage.getItem('SessionID');

//             await GoogleSignin.hasPlayServices();
//             const userInfo = await GoogleSignin.signIn();
//             const userToken = await GoogleSignin.getTokens();
//             let cipher = cryptoJS.AES.encrypt(userToken.accessToken, "RevalKey");
//             cipher = cipher.toString();

//             const params = {

//                 'BasketGUID': CartGuid,
//                 'SessionId': SessionID,
//                 'SourceType': "google",
//                 'Token': cipher,
//                 'UTM_Content': "organic",
//                 'UTM_Medium': "organic",
//                 'UTM_Source': "organic",
//                 'UTM_Term': "organic",

//             }

//             api.postData('/api/SocialLogin', params).then((response) => {
//                 console.log(response);
//                 //alert(response.data.ReturnMessage)

//                 if (response.data.ReturnCode == 0) {

//                     AsyncStorage.setItem('BasketGuid', response.data.Data[0].BasketGuid);
//                     AsyncStorage.setItem('CartCount', JSON.stringify(response.data.Data[0].CartCount));
//                     AsyncStorage.setItem('CountryId', JSON.stringify(response.data.Data[0].CountryId));
//                     AsyncStorage.setItem('CustomerStatusId', JSON.stringify(response.data.Data[0].CustomerStatusId));
//                     AsyncStorage.setItem('CustomerToken', response.data.Data[0].CustomerToken);
//                     AsyncStorage.setItem('CustomerUniqueId', JSON.stringify(response.data.Data[0].CustomerUniqueId));
//                     AsyncStorage.setItem('UserEmail', response.data.Data[0].Email);
//                     AsyncStorage.setItem('FirstName', response.data.Data[0].FirstName);
//                     navigation.navigate('Home');

//                     // AsyncStorage.setItem('IsExistingCustomer', response.data.Data[0].IsExistingCustomer);
//                     if (From == 'Checkout') {
//                         navigation.push('Checkout');
//                     } else {
//                         navigation.navigate('Home');
//                     }
//                     getGlobalVarsF().showSignOutF();
//                     getCartGlobalVarsF().showCartCountF();

//                     setResponseMessage(response.data.ReturnMessage);

//                 } else if (response.data.ReturnMessage == 'Email address required.') {

//                     navigation.navigate('RegisterScreen');
//                 } else {
//                     setResponseMessage(response.data.ReturnMessage);
//                 }

//             })
//                 .catch(function (error) {
//                     // console.log(error);
//                     //alert(error);
//                 });


//             console.log('Success')
//         } catch (error) {
//             console.log(error)
//         }

//     }


//     return (
//         // <View style={{marginTop:15}}>
//         //     {/* <GoogleSigninButton
//         //         onPress={signIn}
//         //         size={GoogleSigninButton.Size.Wide}
//         //         color={GoogleSigninButton.Color.Dark}
//         //         style={{ width: 200, height: 40, marginTop: 10 }}
//         //     /> */}
//         //     <TouchableOpacity
//         //                 testID={'btngooglelogin'} onPress={signIn} style={{borderWidth:1, borderColor:'#ddd', backgroundColor:'#fff', flexDirection:'row', width:w/1.08, height:h/16, alignItems:'center', justifyContent:'center', borderRadius:5, elevation:2}} >
//         //         < Image
//         //             source={{ uri: "https://static01.manyavar.com/uploads/images/gplus.png" }}
//         //             resizeMode="contain"
//         //             style={{ height:25, width:25 }}
//         //         />
//         //         <Text style={{fontFamily: Platform.OS == 'ios' ? 'Philosopher-Regular' : 'Philosopher Bold', fontWeight: Platform.OS == 'ios' ? '700' : 'normal', paddingLeft:15}}> Login with Google </Text>
//         //     </TouchableOpacity>
//         //     {responseMessage != '' && (
//         //         <InformationPopup message={responseMessage} />
//         //     )}
//         // </View>

//         <View style={{ flexDirection: 'row', alignItems: 'center',marginRight:0 }}>
//             <TouchableOpacity testID={'btngooglelogin'} onPress={signIn} style={{ height: 60, width: Dimensions.get('window').width / 4, alignItems: 'center', justifyContent: 'center', }}>
//                 <Image source={require('../../asserts/google.png')} style={{ width: 25, height: 25, marginTop: 0, resizeMode: 'contain' }} />
//                 <Text style={{ fontSize: 14, color: '#DF4A32',  paddingHorizontal: 10, textAlign: 'center',paddingTop:8 }}>
//                     Google
//                 </Text>
//             </TouchableOpacity>
//             {responseMessage != '' && (
//                 <InformationPopup message={responseMessage} />
//             )}
//         </View>
//     )

// }

// export default GoogleLogin;

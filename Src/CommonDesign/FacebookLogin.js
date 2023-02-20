import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import api from '../Helper/helperModule';
import cryptoJS from 'react-native-crypto-js';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGlobalVarsF, setGlobalVarsF } from '../Helper/loginhelper';
import Ionicons from 'react-native-vector-icons/FontAwesome';
import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import InformationPopup from '../CommonDesign/InformationPopup';
import { getCartGlobalVarsF, setCartGlobalVarsF } from '../Helper/cartcounthelper';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const FacebookLogin = ({ navigation,From }) => {

    const [responseMessage, setResponseMessage] = useState('');

    const LoginFacebook = async () => {
        let CartGuid = await AsyncStorage.getItem('BasketGuid');
        let SessionID = await AsyncStorage.getItem('SessionID');
        if (AccessToken.getCurrentAccessToken() != null) {
            LoginManager.logOut();
        }
        LoginManager.logInWithPermissions(["public_profile", "email"]).then(
            function (result) {
                if (result.isCancelled) {
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            var tokenAccess = data.accessToken.toString();

                            let encryptToken = tokenAccess;
                            let cipher = cryptoJS.AES.encrypt(encryptToken, "RevalKey");
                            cipher = cipher.toString();
                            if (data != '' && data != undefined) {

                                const params = {

                                    'BasketGUID': CartGuid,
                                    'SessionId': SessionID,
                                    'SourceType': "FACEBOOK",
                                    'Token': cipher,
                                    'UTM_Content': "organic",
                                    'UTM_Medium': "organic",
                                    'UTM_Source': "organic",
                                    'UTM_Term': "organic",

                                }

                                api.postData('/api/SocialLogin', params).then((response) => {
                                    //alert(response.data.ReturnMessage)

                                    if (response.data.ReturnMessage == 'Sucess') {

                                        AsyncStorage.setItem('BasketGuid', response.data.Data[0].BasketGuid);
                                        AsyncStorage.setItem('CartCount', JSON.stringify(response.data.Data[0].CartCount));
                                        AsyncStorage.setItem('CountryId', JSON.stringify(response.data.Data[0].CountryId));
                                        AsyncStorage.setItem('CustomerStatusId', JSON.stringify(response.data.Data[0].CustomerStatusId));
                                        AsyncStorage.setItem('CustomerToken', response.data.Data[0].CustomerToken);
                                        AsyncStorage.setItem('CustomerUniqueId', JSON.stringify(response.data.Data[0].CustomerUniqueId));
                                        AsyncStorage.setItem('UserEmail', response.data.Data[0].Email);
                                        AsyncStorage.setItem('FirstName', response.data.Data[0].FirstName);
                                        //AsyncStorage.setItem('IsExistingCustomer', response.data.Data[0].IsExistingCustomer);
                                       // navigation.navigate('Home');


                                        //  getGlobalVarsF().showSignOutF();
                                        // if (From == 'check') {
                                        //     navigation.push('Checkout');
                                        // } else {
                                        //     navigation.navigate('Home');
                                        // }

                                        getGlobalVarsF().showSignOutF();
                                        getCartGlobalVarsF().showCartCountF();
                                        if (From == 'Checkout') {
                                            navigation.push('Checkout');
                                        } else {
                                            navigation.navigate('Home');
                                        }

                                       

                                        setResponseMessage(response.data.ReturnMessage);

                                    } else if (response.data.ReturnMessage == 'Email address required.') {

                                        navigation.navigate('RegisterScreen');
                                    } else {
                                        setResponseMessage(response.data.ReturnMessage);
                                    }

                                })
                                    .catch(function (error) {
                                        // console.log(error);
                                        //alert(error);
                                    });

                            }

                        }
                    )
                }
            },
            function (error) {
                console.log('Login Fail:' + error);
            }
        )
    }

    return (
        // <View style={{ marginTop: 10 }}>
        //     <TouchableOpacity
        //                 testID={'btnfblogin'} onPress={() => LoginFacebook()} style={{ backgroundColor: '#44619a', borderRadius: 5, width: w / 1.08, height: h / 16, alignItems: 'center', justifyContent: 'center' }}>
        //         <View style={{ flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 20 }}>
        //             <Ionicons name={'facebook-official'} size={20} color='#fff' />
        //             <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Philosopher-Regular', marginLeft: 15 }}>Login With Facebook</Text>
        //         </View>
        //     </TouchableOpacity>
        //     {responseMessage != '' && (
        //         <InformationPopup message={responseMessage} />
        //     )}
        // </View>

<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 0 }}>
<TouchableOpacity testID={'btnfblogin'} onPress={() => LoginFacebook()} style={{ height: 60, width: Dimensions.get('window').width / 4, alignItems: 'center', justifyContent: 'center' }}>
    <Entypo size={30} name={'facebook-with-circle'} color={'#3B5998'} />
    <Text style={{ fontSize: 14, color: '#3B5998',  paddingTop: 8, paddingBottom: 8, textAlign: 'center' }}>
        Facebook
    </Text>
</TouchableOpacity>
    {responseMessage != '' && (
                <InformationPopup message={responseMessage} />
            )}
</View>



    );

}




export default FacebookLogin;
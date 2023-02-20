import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, Text, Dimensions, ActivityIndicator, StyleSheet, TextInput, Platform } from 'react-native';
import cryptoJS from 'react-native-crypto-js';
import { getGlobalVarsF, setGlobalVarsF } from '../Helper/loginhelper';
import api from '../Helper/helperModule';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appleAuthAndroid, appleAuth, } from '@invertase/react-native-apple-authentication';
import { v4 as uuid } from 'uuid'
import Ionicons from 'react-native-vector-icons/Ionicons';
import WebView from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import InformationPopup from '../CommonDesign/InformationPopup';


const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;
// Apple authentication requires API 19+, so we check before showing the login button
const AppleLogin = ({ navigation, route }) => {
    const [loader, setLoader] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [errEmailField, setErrorEmailField] = useState('');
    const [err, setErr] = useState(null);
    //webview = null;

    useEffect(() => {
        // let pagefrom = route.params.pagefrom;
        // console.log('pagefrom ------', pagefrom);
        // if (pagefrom) {
        //     setPagefrom(pagefrom);
        // }
        const unsubscribe = navigation.addListener('focus', () => {
            clearInputField();
        });
        return () => unsubscribe;
    }, []);

    const clearInputField = () => {
        setEmail('');

    }

    useEffect(() => {
        // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
        return appleAuth.onCredentialRevoked(async () => {
          console.warn('If this function executes, User Credentials have been Revoked');
        });
      }, []);

    const validateForm = () => {
        let isFormValidated = true;
        let regexEmail = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
        let isValidEmail = regexEmail.test(email);

        let errors = {

            emailErr: null,
        }

        if (email == '' || email == null) {
            errors.emailErr = 'Enter Email Address.'
            isFormValidated = false;
            setErrorEmailField(errors.emailErr);
        } else if (!isValidEmail) {
            errors.emailErr = 'Invalid Email Address.'
            isFormValidated = false;
            setErrorEmailField(errors.emailErr);
        } else {
            setErrorEmailField('');

        }
        if (!isFormValidated) {

            setErr(errors)
            return false
        }
        return true
        // return true
    }

    const handleWebViewNavigationStateChange = async (newNavState) => {

        const { url } = newNavState;
        if (!url) return;

        if (url.includes('code=')) {
            let arr = url.split('code=');
            //webview.stopLoading();

            let Token = arr[1].replace(/%22/g, "\"")
            let CartGuid = await AsyncStorage.getItem('BasketGuid');
            let SessionID = await AsyncStorage.getItem('SessionID');

            const getAppleResponse = cryptoJS.AES.encrypt(Token, "RevalKey").toString();
            setLoader(true);
            const params = {
                'BasketGUID': CartGuid == null ? "" : CartGuid,
                'SessionId': SessionID,
                'SourceType': "APPLE",
                'Token': getAppleResponse,
                'UTM_Content': "organic",
                'UTM_Medium': "organic",
                'UTM_Source': "organic",
                'UTM_Term': "organic",
            }
            api.postData('/api/SocialLogin', params).then((response) => {
                if (response.data.ReturnCode == 0) {
                    AsyncStorage.setItem('CustomerToken', response.data.Data[0].CustomerToken);
                    AsyncStorage.setItem('CustomerStatusId', JSON.stringify(response.data.Data[0].CustomerStatusId));
                    AsyncStorage.setItem('CountryId', JSON.stringify(response.data.Data[0].CountryId));
                    AsyncStorage.setItem('FirstName', response.data.Data[0].FirstName);
                    AsyncStorage.setItem('CartCount', JSON.stringify(response.data.Data[0].CartCount));
                    AsyncStorage.setItem('BasketGuid', response.data.Data[0].BasketGuid);
                    getGlobalVarsF().showSignOutF();
                    setResponseMessage(response.data.ReturnMessage);
                    setLoader(false);
                    // if (route.params?.From == 'check') {
                    //     navigation.push('Checkout');
                    // } else {
                        navigation.navigate('Home');
                    //}
                }

            })
                .catch(function (error) {
                    console.log(error);
                    //alert(error);
                });
        }

    }
    
    const onAppleButtonPress =async () => {

       if( Platform.os =='android'){
        // Generate secure, random values for state and nonce
        const rawNonce = uuid();
        const state = uuid();
      
        // Configure the request
        appleAuthAndroid.configure({
          // The Service ID you registered with Apple
          clientId: 'com.Revalsys.KLM.UAT',
      
          // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
          // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
         // redirectUri: 'https://example.com/auth/callback',
      
          // The type of response requested - code, id_token, or both.
          responseType: appleAuthAndroid.ResponseType.ALL,
      
          // The amount of user information requested from Apple.
          scope: appleAuthAndroid.Scope.ALL,
      
          // Random nonce value that will be SHA256 hashed before sending to Apple.
          nonce: rawNonce,
      
          // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
          state,
        });
      
        // Open the browser window for user sign in
        const response = await appleAuthAndroid.signIn();
    }
    else{
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
          });
        
          // get current authentication state for user
          // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
          const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
        
          // use credentialState response to ensure the user is authenticated
          if (credentialState === appleAuth.State.AUTHORIZED) {
            // user is authenticated
          }
    }
    }      

    const validateEmailField = () => {

        let isFormValidated = true;

        let errors = {
            emailErr: '',
        }

        let regexEmail = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
        let isValidEmail = regexEmail.test(email);

        if (email == '' || email == null) {
            errors.emailErr = 'Enter Email Address.'
            isFormValidated = false;
            setErrorEmailField(errors.emailErr);
        } else if (!isValidEmail) {
            errors.emailErr = 'Invalid Email Address.'
            isFormValidated = false;
            setErrorEmailField(errors.emailErr);
        } else {
            setErrorEmailField('');
        }
        if (!isFormValidated) {

            setErr(errors)
            return false
        }
        return true
    }

    const GuestCheckoutOTP = () => {
        // setEnterOTP('');
        // setErrorOTP('');
        setResponseMessage('');

        if (validateForm() === true) {
            setErr(null)
           // onSubmitForm()
           //handleWebViewNavigationStateChange()
           onAppleButtonPress()
        }
        else {
            console.log('Invalid inputs')
        }
    }

    if (loader == true) {
        return (
            <View style={{ flex: 1 }}>
                <ActivityIndicator style={{ alignSelf: 'center', flex: 1 }} size="large" color="#900C19" />
            </View>
        )
    } else {
        return (
            <View style={{ flex: 1 }}>
                {/* <WebView
          onNavigationStateChange={handleWebViewNavigationStateChange}
          source={{ uri: "https://appleid.apple.com/auth/authorize?client_id=com.Revalsys.Manyavar.WebApp.sid&redirect_uri=https%3A%2F%2Fwww.manyavar.com%2Fusers%2Fsign_in%2Fapple&response_mode=form_post&response_type=code%20id_token&scope=name%20email&state=users%2Fsign_in" }}></WebView>*/}


                <View style={styles.InputTextVIew}>
                    {/* <Text style={[styles.InputTextLabel, { marginRight: w / 1.6 }]}>Email Id</Text> */}
                    <TextInput
                        testID={'txtEmail'}
                        style={styles.InputStyle}
                        placeholderTextColor="#ccc"
                        onBlur={() => validateEmailField()}
                        onChangeText={(email) => setEmail(email)}
                        value={email}
                        placeholder="Apple Id"
                    />
                </View>
                {err && <View
                    style={styles.errorstyle}
                >
                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errEmailField}</Text>
                </View>}
                {/* {responseMessage != '' && <View style={styles.errorstyle}>
                        <Text testID={'lblerrormsg'} style={styles.errMsg}>{responseMessage}</Text>
                    </View>} */}
                {(responseMessage != 'Sucess' && responseMessage != '') ? <View style={styles.errorstyle}>
                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{responseMessage}</Text>
                </View>
                    : null}

                <TouchableOpacity
                    onPress={() => GuestCheckoutOTP()}
                >
                    <LinearGradient colors={['#eb4b45', '#f18210']} style={styles.linearGradient} useAngle={true} angle={90}>
                        <Text style={styles.buttonText}>
                            SUBMIT
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>


                {responseMessage != '' && (
                    <InformationPopup message={responseMessage} />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    errMsg: { color: '#262626', fontSize: 12, textAlign: 'left', marginLeft: 15 },
    InputStyle: { paddingLeft: 16, paddingRight: 10, flex: 1, paddingTop: 6, paddingVertical: 5, borderColor: '#ccc', borderRadius: 8, justifyContent: 'center', height: 50 },
    InputTextVIew: { borderWidth: 1, borderColor: '#ccc', marginLeft: 30, marginRight: 30, marginTop: 20, borderRadius: 8, height: 60 },
    InputTextLabel: { fontSize: 14, color: '#89681f', top: -8, backgroundColor: '#fff', paddingHorizontal: 10, marginLeft: 15, },
    errorstyle: { backgroundColor: '#F7D7DA', margin: 3, paddingTop: 5, paddingBottom: 5, paddingLeft: 0, paddingRight: 10, marginLeft: 30, marginRight: 30, borderRadius: 8, height: 40, justifyContent: 'center' },
    linearGradient: { alignItems: 'center', justifyContent: 'center', height: 60, borderRadius: 8, marginLeft: 30, marginRight: 30, marginTop: 15 },
    buttonText: { fontSize: 19, color: '#fff',  },
})
export default AppleLogin;
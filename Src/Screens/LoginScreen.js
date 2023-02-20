import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator, Platform, Dimensions

} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getGlobalVarsF, setGlobalVarsF } from '../Helper/loginhelper';
import { getCartGlobalVarsF, setCartGlobalVarsF } from '../Helper/cartcounthelper';
import cryptoJS from 'react-native-crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../Helper/helperModule';
import axios from 'axios';
import InformationPopup from '../CommonDesign/InformationPopup';
import LinearGradient from 'react-native-linear-gradient';
import HomeHeader from '../CommonDesign/HomeHeader';
import HeaderCate from '../CommonDesign/HeaderCate';
import Footer from '../CommonDesign/Footer';
import Path from '../Helper/Api';
import FacebookLogin from '../CommonDesign/FacebookLogin';
//import GoogleLogin from '../CommonDesign/GoogleLogin';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { v4 as uuid } from 'uuid'

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;
const LoginScreen = ({ navigation, route }, props) => {
    console.log('routeparams---', route.params)
    const [email, setEmail] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErr, setPasswordErr] = useState("");
    const [loader, setLoader] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [inputError, setInputError] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [err, setErr] = useState(null);
    const [errEmailField, setErrorEmailField] = useState('');
    const [errPasswordField, setErrPasswordField] = useState('');
    const [pagefrom, setPagefrom] = useState('');
    const [buttonLoader, setButtonLoader] = useState(false);

    const [errresponse, setErrresponse] = useState('')

    useEffect(() => {
        let pagefrom = route.params.pagefrom;
        if (pagefrom != undefined) {
            setPagefrom(pagefrom);
        } else {
            setPagefrom('');

        }

        const unsubscribe = navigation.addListener('focus', () => {
            clearInputField();
        });
        return () => unsubscribe;
    }, []);

    const clearInputField = () => {
        setEmail('');
        setPassword('');
        setErrorEmailField('');
        setErrPasswordField('');
        setResponseMessage('');
        setErrresponse('');
    }


    ////////////////////////////////////Apple login////////////////////

    // useEffect(() => {
    //     // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    //    if(Platform.OS === 'ios'){
    //     return appleAuth.onCredentialRevoked(async () => {
    //       console.warn('If this function executes, User Credentials have been Revoked');
    //     });
    //     }
    //   }, []);


    // async function onAppleButtonPress(){

    //     let CartGuid = await AsyncStorage.getItem('BasketGuid');
    //     let SessionID = await AsyncStorage.getItem('SessionID');

    //     if( Platform.OS ==='android'){
    //         try{
    //      // Generate secure, random values for state and nonce
    //      const rawNonce = uuid();
    //      const state = uuid();

    //      // Configure the request
    //      appleAuthAndroid.configure({
    //        // The Service ID you registered with Apple
    //        clientId: 'com.Revalsys.KLM.UAT.signin',

    //        // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
    //        // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
    //       // redirectUri: 'https://example.com/auth/callback',
    //          redirectUri:'https://klm.revalweb.com/',
    //        // The type of response requested - code, id_token, or both.
    //        responseType: appleAuthAndroid.ResponseType.ALL,

    //        // The amount of user information requested from Apple.
    //        scope: appleAuthAndroid.Scope.ALL,

    //        // Random nonce value that will be SHA256 hashed before sending to Apple.
    //        nonce: rawNonce,

    //        // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
    //        state,
    //      });

    //      // Open the browser window for user sign in
    //      const response = await appleAuthAndroid.signIn();
    //      console.log('apple signin response from android token-----',response.id_token)

    //      const getAppleResponse = cryptoJS.AES.encrypt(JSON.stringify(response.id_token), "RevalKey").toString();
    //      const params = {

    //        'BasketGUID': CartGuid,
    //        'SessionId': "",
    //        'SourceType': "APPLE",
    //        'Token': getAppleResponse,
    //        'UTM_Content': "organic",
    //        'UTM_Medium': "organic",
    //        'UTM_Source': "organic",
    //        'UTM_Term': "organic",

    //      }

    //      api.postData('/api/SocialLogin', params).then((response) => {
    //        console.log(response);


    //        if (response.data.ReturnMessage == 'Sucess') {

    //          AsyncStorage.setItem('CustomerToken', response.data.Data[0].CustomerToken);
    //          AsyncStorage.setItem('CustomerStatusId', response.data.Data[0].CustomerStatusId);
    //          AsyncStorage.setItem('CountryId', response.data.Data[0].CountryId);
    //          AsyncStorage.setItem('FirstName', response.data.Data[0].FirstName);
    //          AsyncStorage.setItem('CartCount', JSON.stringify(response.data.Data[0].CartCount));
    //          AsyncStorage.setItem('BasketGuid', response.data.Data[0].BasketGuid);

    //          getGlobalVarsF().showSignOutF();
    //          navigation.navigate('Home');

    //        }

    //      })
    //        .catch(function (error) {
    //          console.log(error);
    //          //alert(error);
    //        });

    //     }
    //     catch(error) {
    //         console.log('error----------',error)
    //     }
    //  }
    //  else{
    //      const appleAuthRequestResponse = await appleAuth.performRequest({
    //          requestedOperation: appleAuth.Operation.LOGIN,
    //          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    //        });

    //        // get current authentication state for user
    //        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    //        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

    //        // use credentialState response to ensure the user is authenticated
    //        if (credentialState === appleAuth.State.AUTHORIZED) {
    //          // user is authenticated
    //          const getAppleResponse = cryptoJS.AES.encrypt(JSON.stringify(appleAuthRequestResponse), "RevalKey").toString();
    //          const params = {

    //            'BasketGUID': CartGuid,
    //            'SessionId': "",
    //            'SourceType': "APPLE",
    //            'Token': getAppleResponse,
    //            'UTM_Content': "organic",
    //            'UTM_Medium': "organic",
    //            'UTM_Source': "organic",
    //            'UTM_Term': "organic",

    //          }

    //          api.postData('/api/SocialLogin', params).then((response) => {
    //            console.log(response);


    //            if (response.data.ReturnMessage == 'Sucess') {

    //              AsyncStorage.setItem('CustomerToken', response.data.Data[0].CustomerToken);
    //              AsyncStorage.setItem('CustomerStatusId', response.data.Data[0].CustomerStatusId);
    //              AsyncStorage.setItem('CountryId', response.data.Data[0].CountryId);
    //              AsyncStorage.setItem('FirstName', response.data.Data[0].FirstName);
    //              AsyncStorage.setItem('CartCount', JSON.stringify(response.data.Data[0].CartCount));
    //              AsyncStorage.setItem('BasketGuid', response.data.Data[0].BasketGuid);

    //              getGlobalVarsF().showSignOutF();
    //              navigation.navigate('Home');

    //            }

    //          })
    //            .catch(function (error) {
    //              console.log(error);
    //              //alert(error);
    //            });
    //        }
    //  }
    //  }    



    /////////////////////////////////////////////////////////////////


    const onsubmit = () => {
        if (validateForm() === true) {
            setErr(null)
            onSubmitForm()
        }
        else {
            console.log('Invalid inputs')
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

    const validatePassword = () => {

        let isFormValidated = true;

        let errors = {
            passwordErr: '',
        }

        if (password == '' || password == null) {
            errors.passwordErr = 'Enter Password.'
            isFormValidated = false;
            setErrPasswordField(errors.passwordErr);
        } else if (password.length < 8) {
            errors.passwordErr = 'The Password Must Have Atleast 8 Characters.'
            isFormValidated = false;
            setErrPasswordField(errors.passwordErr);
        } else {
            setErrPasswordField('');
        }
        if (!isFormValidated) {
            setErr(errors)
            return false
        }
        return true
    }


    const validateForm = () => {
        let isFormValidated = true;
        let regexEmail = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
        let isValidEmail = regexEmail.test(email);

        let errors = {

            emailErr: null,
            passwordErr: null,
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
        if (password == '' || password == null) {
            errors.passwordErr = 'Enter Password.'
            isFormValidated = false;
            setErrPasswordField(errors.passwordErr);
        } else if (password.length < 8) {
            errors.passwordErr = 'The Password Must Have Atleast 8 Characters.'
            isFormValidated = false;
            setErrPasswordField(errors.passwordErr);
        } else {
            setErrPasswordField('');
        }
        if (!isFormValidated) {

            setErr(errors)
            return false
        }
        return true
        // return true
    }

    const onSubmitForm = async () => {
        setButtonLoader(true)
        let CartGuid = await AsyncStorage.getItem('BasketGuid');
        let SessionID = await AsyncStorage.getItem('SessionID');

        let encryptPassword = password;
        let cipher = cryptoJS.AES.encrypt(encryptPassword, "RevalKey");
        cipher = cipher.toString();

        //alert(cipher);

        const params = {
            BasketGUID: CartGuid,
            Email: email,
            SessionId: SessionID,
            StaySignedIn: 0,
            UTM_Content: "organic",
            UTM_Medium: "organic",
            UTM_Source: "organic",
            UTM_Term: "organic",
            UserPassword: cipher,
        }


        // let data= "";
        // data = JSON.stringify(params);
        // alert(data);

        api.postData(Path.login, params).then((response) => {
            if (response.data.ReturnCode == 0) {
                AsyncStorage.setItem('BasketGuid', response.data.Data[0].BasketGuid);
                AsyncStorage.setItem('CartCount', JSON.stringify(response.data.Data[0].CartCount));
                AsyncStorage.setItem('CountryId', JSON.stringify(response.data.Data[0].CountryId));
                AsyncStorage.setItem('CustomerStatusId', JSON.stringify(response.data.Data[0].CustomerStatusId));
                AsyncStorage.setItem('CustomerToken', response.data.Data[0].CustomerToken);
                AsyncStorage.setItem('CustomerUniqueId', JSON.stringify(response.data.Data[0].CustomerUniqueId));
                AsyncStorage.setItem('UserEmail', response.data.Data[0].Email);
                AsyncStorage.setItem('FirstName', response.data.Data[0].FirstName);
                AsyncStorage.setItem('IsExistingCustomer', response.data.Data[0].IsExistingCustomer);

                getGlobalVarsF().showSignOutF();
                getCartGlobalVarsF().showCartCountF();
                setButtonLoader(false)

                // if (pagefrom != '') {
                //     // navigation.goBack();
                //     navigation.navigate(pagefrom)
                // }
                // else {

                //     navigation.navigate('Home')
                // }
                if (pagefrom === 'ProductList') {
                    // navigation.goBack();
                    navigation.navigate(pagefrom, { cat1: route.params.cat1, cat2: route.params.cat2, cat3: route.params.cat3, url: route.params.url })
                } else if (pagefrom === 'PDP') {
                    navigation.navigate(pagefrom, { url: route.params.url, sizeName: route.params.sizeName })
                }
                // else if(pagefrom === 'Cart'){
                //     navigation.navigate(pagefrom, { url: route.params.url,sizeName:route.params.sizeName })
                // }
                else if (pagefrom != 'ProductList' && pagefrom != 'PDP' && pagefrom != '') {
                    navigation.navigate(pagefrom)
                }
                else {

                    navigation.navigate('Home')
                }

                setLoader(false);
                setResponseMessage(response.data.ReturnMessage);



            } else {
                setLoader(false);
                //setPasswordErr(response.data.ReturnMessage);
                setButtonLoader(false);
                setResponseMessage(response.data.ReturnMessage);
                setErrresponse(response.data.ReturnMessage);
                // setResponseMessage(response.data.ReturnMessage);
                // showModal();
            }
        })
            .catch(function (error) {
                console.log(error);
                //alert(error);
            });

    };

    if (loader == true) {
        return (
            <View style={{ flex: 1 }}>
                <HomeHeader navigation={navigation} menuBut={'Menu'} />
                {/* <CommonHeader navigation={navigation} /> */}
                <ActivityIndicator style={{ alignSelf: 'center', flex: 1 }} size="large" color="#900C19" />
            </View>
        )
    } else {


        return (

            <View style={{ flex: 1 }}>
                <ScrollView style={styles.container}>
                    {/* <CommonHeader navigation={navigation} /> */}
                    {/* <View>
                        <Text style={styles.loginText}>LOGIN / SIGNUP</Text>
                    </View> */}

                    <HomeHeader navigation={navigation} menuBut={'Menu'} />
                    <ScrollView style={{ flex: 1 }}>
                        <HeaderCate navigation={navigation} />
                    </ScrollView>

                    <View style={styles.loginEmailTextView}>
                        <Text style={styles.loginEmailText}>Sign In</Text>
                    </View>

                    <View style={styles.InputTextVIew}>
                        {/* <Text style={[styles.InputTextLabel, { marginRight: w / 1.6 }]}>Email Id</Text> */}
                        <TextInput
                            testID={'txtEmail'}
                            style={styles.InputStyle}
                            placeholderTextColor={'gray'}
                            onBlur={() => validateEmailField()}
                            onChangeText={(email) => { setEmail(email), setErrorEmailField(''), setErrresponse('') }}
                            value={email}
                            placeholder="Email Address*"
                        />
                    </View>
                    {err && errEmailField ? <View
                    // style={styles.errorstyle}
                    >
                        <Text testID={'lblerrormsg'} style={styles.errMsg}>{errEmailField}</Text>
                    </View> : null}

                    <View style={styles.InputTextVIew}>
                        {/* <Text style={[styles.InputTextLabel, { marginRight: w / 1.6 }]}>Email Id</Text> */}
                        <TextInput
                            testID={'txtPassword'}
                            style={styles.InputStyle}
                            placeholderTextColor={'gray'}
                            onBlur={() => validatePassword()}
                            secureTextEntry={true}
                            onChangeText={(password) => { setPassword(password), setErrPasswordField(''), setErrresponse('') }}
                            value={password}
                            placeholder="Password*"
                            maxLength={16}
                        />
                    </View>
                    {(err && errPasswordField != '') ? <View
                    //style={styles.errorstyle}
                    >
                        <Text testID={'lblerrormsg'} style={styles.errMsg}>{errPasswordField}</Text>
                    </View>
                        : null}
                    {/* <View style={styles.InputTextVIew}>
                        <Text style={[styles.InputTextLabel, { marginRight: w / 1.6 }]}>PASSWORD*</Text>
                        <TextInput
                            testID={'txtPassword'}
                            style={styles.InputStyle}
                            placeholderTextColor="#003f5c"
                            onBlur={() => validatePassword()}
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                            value={password}
                        />   KLM5471724378
                    </View> 
                    {err && <View>
                        <Text testID={'lblerrormsg'} style={styles.errMsg}>{errPasswordField}</Text>
                    </View>}*/}
                    {(errPasswordField == '' && errresponse != undefined && errresponse != '' && errresponse != null) ? <View
                    // style={styles.errorstyle}
                    >
                        <Text testID={'lblerrormsg'} style={styles.errMsg}>{errresponse}</Text>
                    </View>
                        : null}

                    <TouchableOpacity
                        onPress={() => onsubmit()}
                    >
                        <LinearGradient colors={['#eb4b45', '#f18210']} style={styles.linearGradient} useAngle={true} angle={90}>
                            {buttonLoader ?
                                <ActivityIndicator color={'#fff'} size={25} style={{ paddingVertical: 13 }} />
                                :
                                <Text style={styles.buttonText}>
                                    SIGN IN
                                </Text>
                            }
                        </LinearGradient>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30 }}>
                        <TouchableOpacity
                            testID={'btnforgotpassword'} style={{ marginTop: 20 }} onPress={() => navigation.navigate('Loginwithotp')}>
                            <Text style={styles.ForgotPasswordText}>Continue with OTP</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            testID={'btnloginwithOTP'} style={{ marginTop: 20 }} onPress={() => navigation.navigate("ForgotPassword")}>
                            <Text style={styles.ForgotPasswordText}>Forgot Password</Text>
                        </TouchableOpacity>
                    </View>
                    {/*<TouchableOpacity
                        testID={'btnlogin'} style={{ marginVertical: 20 }} onPress={() => onsubmit()}>
                        <ButtonCustom Title={'LOGIN'} BtuSize={80} />
                    </TouchableOpacity>*/}
                    <View style={{ height: 3, margin: 30, backgroundColor: '#F7D7DA' }}>
                    </View>
                    <View style={{ marginTop: 0, }}>
                        <View style={{ flexDirection: 'row', marginLeft: 30, marginRight: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={styles.UseText}> New to ILOVEKLM? </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate("RegisterScreen", { pagefrom: pagefrom })}
                            >
                                <Text style={[styles.UseText, { textDecorationLine: 'underline' }]}>
                                    SIGN UP
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* <View style={{ alignItems: 'center', marginBottom: 20 }}>
                        <FacebookLogin navigation={navigation} />                        
                        <GoogleLogin navigation={navigation} />
                        <View style={{ marginTop: 15 }}>
                            <Text style={{  marginTop: 8, marginBottom: 8, fontSize: 22, color: '#262626' }}> Or Sign with </Text> 
                        </View>
                         <AppleLogin navigation={navigation} />
                    </View> */}
                    {/*  <FacebookLogin navigation={navigation} From={pagefrom} /> */}
                    {/* <GoogleLogin navigation={navigation} From={pagefrom}/> */}
                    {/* {appleAuthAndroid.isSupported &&(
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                testID={'btnapplelogin'} 
                                onPress={()=>onAppleButtonPress()}
                                //onPress={() => navigation.navigate('AppleLogin')} 
                                style={{ height: 60, width: Dimensions.get('window').width / 4, alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons size={25} name={'logo-apple'} />
                                <Text style={{  fontWeight: Platform.OS == 'ios' ? '700' : 'normal', paddingTop: 8, paddingBottom: 8, textAlign: 'center', fontSize: 14 }}> Apple SignIn </Text>
                            </TouchableOpacity>
                        </View>
                         )} */}

                    {responseMessage != '' && (
                        <InformationPopup message={responseMessage} />
                    )}

                    <View style={{ marginTop: 10, marginBottom: 0 }}>
                        <Footer navigation={navigation} />
                    </View>

                </ScrollView>

            </View>

        );
    }




}



const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "#fff", textAlign: 'center' },
    loginText: { marginTop: -20, marginBottom: 20, fontSize: 18, color: '#aa8531', textAlign: 'center', },
    loginEmailTextView: { fontSize: 13, paddingTop: 13, paddingBottom: 13 },
    loginEmailText: { textAlign: 'center', color: '#262626', fontFamily: 'roboto', letterSpacing: 0, fontSize: 27, fontWeight: '500' },

    ForgotPasswordText: { textAlign: 'center', color: '#212529', fontSize: 16, textDecorationLine: 'underline' },
    LoginButton: { backgroundColor: '#900c19', paddingTop: 10, padding: 10, width: '60%' },
    LoginText: { color: '#f2c452', fontSize: 14, textAlign: 'center', },
    UseText: { textAlign: 'center', color: '#000', fontSize: 16, letterSpacing: 0 },
    RegisterSection: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#f5f1e9', paddingTop: 13, paddingBottom: 13, marginBottom: 30 },
    NotMemberText: { textAlign: 'center', color: '#9b7c35', fontSize: 14, letterSpacing: 1.4 },
    RegisterButton: { textAlign: 'center', textDecorationLine: 'underline', color: '#900c19', fontSize: 14, letterSpacing: 1.4, paddingLeft: 10 },
    errMsg: { color: '#c00000', fontSize: 12, textAlign: 'left', marginLeft: 15, paddingLeft: 15, paddingTop: 5 },
    InputStyle: { paddingLeft: 16, color: '#000', paddingRight: 10, flex: 1, paddingTop: 6, paddingVertical: 5, borderColor: '#ccc', borderRadius: 8, justifyContent: 'center', height: 50, },
    InputTextVIew: { borderWidth: 1, borderColor: '#ccc', marginLeft: 30, marginRight: 30, marginTop: 20, borderRadius: 8, },
    InputTextLabel: { fontSize: 14, color: '#89681f', top: -8, backgroundColor: '#fff', paddingHorizontal: 10, marginLeft: 15, },
    errorstyle: { margin: 3, paddingBottom: 5, paddingLeft: 0, paddingRight: 10, marginLeft: 18, marginRight: 30, borderRadius: 8, height: 20, justifyContent: 'center' },
    linearGradient: { alignItems: 'center', justifyContent: 'center', height: 60, borderRadius: 8, marginLeft: 30, marginRight: 30, marginTop: 15 },
    buttonText: { fontSize: 19, color: '#fff', }
});

export default LoginScreen;
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Keyboard,
    ScrollView,
    Image, Platform
} from "react-native";

import HomeFooter from '../CommonDesign/Footer';


import api from '../Helper/helperModule';
import HomeHeader from '../CommonDesign/HomeHeader';

import InformationPopup from '../CommonDesign/InformationPopup';
import HeaderCate from '../CommonDesign/HeaderCate';
import LinearGradient from 'react-native-linear-gradient';
import Path from '../Helper/Api';

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [responseMessage, setResponseMessage] = useState('');
    const [err, setErr] = useState(null);
    const [errEmail, setErrorEmail] = useState('');
    const [buttonLoader, setButtonLoader] = useState(false);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            clearinput();
        });
        return () => unsubscribe;
    }, []);

    const clearinput = () => {
        //setErr(null);
        setErrorEmail('');
        setResponseMessage('');
    }

    const onsubmit = () => {
        if (validateForm() === true) {
            setErr(null)
            onSubmitForm()
        }
        else {
            console.log('Invalid inputs')
        }
    }

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
            setErrorEmail(errors.emailErr);
        } else if (!isValidEmail) {
            errors.emailErr = 'Invalid Email Address.'
            isFormValidated = false;
            setErrorEmail(errors.emailErr);
        } else {
            setErrorEmail('');
        }
        if (!isFormValidated) {

            setErr(errors)
            return false
        }
        return true
        // return true
    }

    const onSubmitForm = () => {
        setButtonLoader(true)

        const params = {
            "CurrencyId": 1,
            "CustomerToken": "",
            "Email": email,
        }


        api.postData(Path.forgotpassword, params).then((response) => {
            // console.log(response);

            if (response.data.ReturnMessage == 'Reset password link has been sent to your email.\r\n') {

                setEmail("");
                setResponseMessage(response.data.ReturnMessage);
                //  navigation.navigate('LoginScreen', { pagefrom: 'Home' });
                setButtonLoader(false)
                setErrorEmail('');

            } else {
                setButtonLoader(false)
                setResponseMessage(response.data.ReturnMessage);
            }
        })

    };



    return (

        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <HomeHeader navigation={navigation} />
                <ScrollView style={{ flex: 1 }}>
                    <HeaderCate navigation={navigation} />
                </ScrollView>

                <View>
                    <Text style={styles.loginText}> Forgot Password</Text>
                </View>

                <View style={styles.InputTextVIew}>
                    <TextInput
                        testID={'txtemail'}
                        style={styles.InputStyle}
                        placeholder="Enter Email Id*"
                        placeholderTextColor='#ccc'
                        onBlur={() => validateForm()}
                        onChangeText={(email) => { setEmail(email), setErrorEmail(''), setResponseMessage('') }}
                        value={email}
                    />
                </View>

                {responseMessage === 'Reset password link has been sent to your email.\r\n' && !errEmail ?
                    <View style={{ marginLeft: 20, marginRight: 20, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', paddingVertical: 5 }}>
                        <Text testID={'lblerrormsg'} style={styles.resetlinktext}>{responseMessage}</Text>
                    </View>
                    : null}

                {err && errEmail ? <View >
                    <Text testID={'lblerrormsg'} style={styles.errMsg}>{errEmail}</Text>
                </View> : null}

                <TouchableOpacity
                    onPress={() => navigation.navigate('Loginwithotp', { pagefrom: '' })}
                    style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
                    <Text style={{ color: '#212529', fontSize: 16, textDecorationLine: 'underline' }}>
                        Return To Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onsubmit()}
                >
                    <LinearGradient colors={['#eb4b45', '#f18210']} style={styles.linearGradient} useAngle={true} angle={90}>
                        {buttonLoader ?
                            <ActivityIndicator color={'#fff'} size={25} style={{ paddingVertical: 13 }} />
                            :
                            <Text style={styles.buttonText}>
                                SUBMIT
                            </Text>
                        }
                    </LinearGradient>
                </TouchableOpacity>
                {responseMessage != '' && (
                    <InformationPopup message={responseMessage} />
                )}
                <View style={{ marginTop: 20, marginBottom: 0 }}>
                    <HomeFooter navigation={navigation} />
                </View>
            </ScrollView>
        </View>
    );

}


const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "#fff", textAlign: 'center' },
    loginText: { marginTop: 30, marginBottom: 24, fontSize: 26, color: '#262626', textAlign: 'center', },
    loginEmailTextView: { fontSize: 13, paddingTop: 13, paddingBottom: 13, },
    loginEmailText: { textAlign: 'center', color: '#7d6224', letterSpacing: 3, fontSize: 18 },
    InputTextVIew: { borderWidth: 1, borderColor: '#ccc', marginLeft: 20, marginRight: 20, marginTop: 0, borderRadius: 8 },
    InputTextLabel: { backgroundColor: '#fff', color: '#3c3c3c', letterSpacing: 0, marginTop: 6, marginBottom: 6, marginLeft: 30, paddingLeft: 16, marginRight: 16 },
    LoginButton: { backgroundColor: '#900c19', paddingTop: 10, padding: 10, width: '60%' },
    LoginText: { color: '#f2c452', fontSize: 14, textAlign: 'center' },
    errMsg: { color: '#c00000', fontSize: 14, textAlign: 'left', marginLeft: 15, paddingLeft: 10, paddingTop: 5 },
    InputStyle: { paddingLeft: 15, paddingRight: 10, flex: 1, paddingVertical: 10, height: 60, color: '#000', },
    linearGradient: { alignItems: 'center', justifyContent: 'center', height: 60, borderRadius: 8, marginLeft: 20, marginRight: 20, marginTop: 25 },
    buttonText: { fontSize: 20, color: '#fff', },
    resetlinktext: { fontSize: 14, color: '#0f5132', textAlign: 'center', paddingLeft: 5, paddingRight: 5 },
    errorstyle: { paddingLeft: 0, paddingRight: 10, marginLeft: 20, marginRight: 20, borderRadius: 8, height: 30, justifyContent: 'center' },
});

export default ForgotPassword;
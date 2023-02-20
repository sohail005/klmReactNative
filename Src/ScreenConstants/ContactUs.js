import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Dimensions, Text, TextInput, SafeAreaView, ActivityIndicator, ScrollView, Modal, Platform, Pressable, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeHeader from '../CommonDesign/HomeHeader';
import api from '../Helper/helperModule';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import cryptoJS from 'react-native-crypto-js';
import InformationPopup from '../CommonDesign/InformationPopup';
// import ShippingT_C from '../Component/ShippingT&C';
import LinearGradient from 'react-native-linear-gradient';
import HeaderCate from '../CommonDesign/HeaderCate';
import MainSlider from '../Screens/MainSlider';
import Footer from '../CommonDesign/Footer';
import Bottomtaballpages from './../CommonDesign/Bottomtaballpages'

const generateGCid = uuid.v4();
const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const ContactUs = ({ navigation }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>

            {/* Common Header */}

            <HomeHeader navigation={navigation} />
            <ScrollView >
                <HeaderCate navigation={navigation} />

                {/* Page Header */}

                <View style={{ padding: 24 }}>
                    <Text style={{ fontSize: 24, color: '#000000' }}>Contact Us</Text>
                    <Text style={{ fontSize: 10, color: '#262626', marginTop: 5 }}>We are here to help you. Get in touch with us from any of these ways:</Text>
                </View>

                {/* Email */}

                <TouchableOpacity
                    onPress={() => Linking.openURL('https://twitter.com/klm_fashionmall')}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 3,
                        borderWidth: 1,
                        borderColor: '#ccc',
                    alignItems:'center',
                        margin: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Image
                            style={{
                                resizeMode: 'contain',margin:12
                            }}
                            source={require('../../asserts/Email.png')} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 18, color: '#000000' }}>Write to us</Text>
                            <Text style={{ fontSize: 14, color: '#000000', width: w/1.65 }}>
                                Drop us a line and we’ll get back you asfast as we can. Email us at
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Facebook */}

                <TouchableOpacity
                    onPress={() => Linking.openURL('https://www.facebook.com/klmfashionmall')}>
                    <View style={{
                        // marginTop:50,
                        backgroundColor: '#fff',
                        borderRadius: 3,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        alignItems:'center',
                        marginHorizontal: 20,
                        marginVertical: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Image
                            style={{
                                resizeMode: 'contain',margin:12
                            }}
                            source={require('../../asserts/Facebook.png')} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 18, color: '#000000' }}>
                                Facebook us
                            </Text>
                            <Text style={{ fontSize: 14, color: '#000000', width: w/1.65 }}>
                                Connect with us on your favourite social network.
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Twitter */}

                <TouchableOpacity
                    onPress={() => Linking.openURL('https://twitter.com/klm_fashionmall')}>
                    <View style={{
                        // marginTop:50,
                        backgroundColor: '#fff',
                        borderRadius: 3,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        alignItems:'center',
                        marginHorizontal: 20,
                        marginVertical: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Image
                            style={{
                                resizeMode: 'contain',margin:12

                            }}
                            source={require('../../asserts/Twitter.png')} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 18, color: '#000000' }}>
                                Tweet us
                            </Text>
                            <Text style={{ fontSize: 14, color: '#000000', width: w/1.65 }}>
                                Reach out in 140 characters! </Text>
                            <Text style={{ fontSize: 14, color: '#000000' }}>We’re @ILOVEKLM
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Whatsapp */}

                <TouchableOpacity
                    onPress={() => Linking.openURL('https://whatsapp.com/klm_fashionmall')}>
                    <View style={{
                        // marginTop:50,
                        backgroundColor: '#fff',
                        borderRadius: 3,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        marginHorizontal: 20,
                        marginVertical: 15,
                        flexDirection: 'row',
                        alignItems:'center',
                        justifyContent: 'space-between'
                    }}>
                        <Image
                            style={{
                                resizeMode: 'contain',margin:12
                            }}
                            source={require('../../asserts/Whatsapp.png')} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 18, color: '#000000' }}>
                                Chat with us
                            </Text>
                            <Text style={{ fontSize: 14, color: '#000000', width: w/1.65 }}>
                                Get answers in real-time. We’re here to
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity>
                                    <Text
                                        style={{
                                            backgroundColor: '#01af3d',
                                            borderRadius: 3,
                                            borderWidth: 1,
                                            borderColor: '#ccc',
                                            width: 76,
                                            height: 25,
                                            fontSize: 14,
                                            color: '#FFFFFF',
                                            flex: 1,
                                            paddingHorizontal: 10,
                                            paddingVertical: 2,
                                            alignItems:'center'
                                        }}>
                                        ONLINE
                                    </Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 14, color: '#000000', marginLeft: 10 }}>Chat now!</Text></View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Call */}

                <TouchableOpacity>
                    <View style={{
                        // marginTop:50,
                        backgroundColor: '#fff',
                        borderRadius: 3,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        marginHorizontal: 20,
                        marginVertical: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems:'center'
                    }}>
                        <Image
                            style={{
                                resizeMode: 'contain',margin:12
                            }}
                            source={require('../../asserts/Call.png')} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ fontSize: 18, color: '#000000' }}>
                                Talk to us
                            </Text>
                            <Text style={{ fontSize: 14, color: '#000000', width: w/1.65 }}>
                                Monday to Sunday, 9:00AM to 10:00PM
                            </Text>
                            <Text style={{ fontSize: 14, color: '#000000' }}>
                                Call us on 040 4852 2466
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <Footer navigation={navigation} />
            </ScrollView>
            {/* <View style={{ bottom: 0 }}>
                <Bottomtaballpages navigation={navigation} />
            </View> */}
        </View>
    )
}

export default ContactUs;

const styles = StyleSheet.create({


})
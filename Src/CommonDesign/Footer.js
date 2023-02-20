import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Image, TextInput, TouchableOpacity, Linking, FlatList } from 'react-native';
import api from '../Helper/helperModule';
import AsyncStorage from '@react-native-async-storage/async-storage';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const Footer = ({ navigation }) => {
    const [emailId, setEmailId] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [copyRight, setCopyRight] = useState('');
    const [customerNumber, setCustomerNumber] = useState('');
    const [contactDetails, setContactDetails] = useState('');
    const [buttonLoader, setButtonLoader] = useState(false);
    const [pagetitles, setPagetitles] = useState([]);
    const [sociallinks, setSociallinks] = useState('');

    useEffect(() => {
        siteOptions();
        getStaticPage();
        getSociallinks();
    }, []);
    const siteOptions = async () => {
        // let CopyRightBeginYear = await AsyncStorage.getItem('CopyRightBeginYear');
        let CopyRightBeginYear = new Date().getFullYear()
        setCopyRight(CopyRightBeginYear);
        let CustomerNumber = await AsyncStorage.getItem('CustomerNumber');
        setCustomerNumber(CustomerNumber);
        let ContactDetails = await AsyncStorage.getItem('ContactDetails');
        setContactDetails(ContactDetails);
    }

    const AddNewsLetter = () => {
        setButtonLoader(true)
        var Request = {
            CustomerToken: "",
            Email: emailId,
        }
        api.postData('/api/AddNewsLetterSignUp', Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    if (response.data.ReturnMessage == 'Invalid email address.') {
                        setMessage(response.data.ReturnMessage);
                        setShowMessage(true);
                        setButtonLoader(false)

                    } else {
                        setMessage(response.data.ReturnMessage);
                        setShowMessage(true);
                        setButtonLoader(false)
                        setEmailId('');
                    }
                }

            }
        });
    }

    const getSociallinks = () => {

        var Request = {
            CurrencyId: "1",
            CustomerToken: "",
            PageURL: 'socialLinks,contact-us,manufacture-details,no-search-results,site-records'

        }
        api.postData('/api/Page', Request).then((response) => {
            // console.log('respone---',response.data.Data[0].PageContent)
            if (response != undefined && response != null) {
                if (
                    response.data.Data != undefined &&
                    response.data.Data != null &&
                    response.data.Data != null

                ) {
                    setSociallinks(response.data.Data[0].PageContent);
                }

            }
        });

    }

    const getStaticPage = () => {

        api.getData('/api/Page').then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data.Data != undefined &&
                    response.data.Data != null &&
                    response.data.Data != null

                ) {
                    setPagetitles(response.data.Data);
                }

            }
        });

    }
    const navFottorPages = (item) => {
        console.log('item  navFottorPages----->', item)
        if (item.PageTitle == 'Contact Us') {
            navigation.navigate('ContactUs')
        } else if (item.PageTitle == 'About Us') {
            navigation.navigate('AboutUs')
        } else if (item.PageTitle == 'Store Locator') {
            navigation.navigate('StoreLocator')
        } else if (item.PageTitle == 'FAQ') {
            navigation.navigate('FAQ')
        } else {
            navigation.navigate('ContentPages', { PageUrl: item.PageURL, Title: item.PageTitle })
        }
    }
    return (
        <View style={{marginTop:25, paddingTop: 25, backgroundColor: '#e9ecef' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000', textTransform: 'uppercase', paddingLeft: 10 }}>Don't Miss Our Updates</Text>
            <Text style={{ fontSize: 14, color: '#000', paddingLeft: 10 }}>Join to get latest KLM offers</Text>
            <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: '#6c757d', marginHorizontal: 10, marginTop: 15, alignItems: 'center' }}>
                <Image style={{ width: 28, height: 28, resizeMode: 'contain', marginLeft: 8 }} source={require('../../asserts/email-icon.png')} />
                <TextInput
                    testID={'txtEmail'}
                    style={{ flex: 1, fontSize: 13, paddingLeft: 8, color: '#000', paddingVertical: 12 }}
                    placeholder={'Please enter an email address'}
                    placeholderTextColor={'#6c757d'}
                    onChangeText={(Txt) => setEmailId(Txt)}
                    value={emailId}
                />
                <TouchableOpacity style={{ backgroundColor: '#000', width: w / 4.5, alignItems: 'center' }} onPress={AddNewsLetter}>
                    {buttonLoader ?
                        <ActivityIndicator color={'#fff'} size={25} style={{ paddingVertical: 13 }} />
                        :
                        <Text style={{ fontSize: 13, color: '#fff', paddingVertical: 17 }}>SUBSCRIBE</Text>
                    }
                </TouchableOpacity>
            </View>
            {message != '' && (
                <View style={{ marginHorizontal: 10, marginTop: 5, borderRadius: 5 }}>
                    <Text style={{ color: message == 'Email address required.' || message == 'Enter Email Address.' || message == 'Invalid email address.' ? '#C00000' : '#0F5132', fontSize: 13, paddingVertical: 5, }}>{message}</Text>
                </View>
            )}
            <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderTopWidth: 1, borderColor: '#6c757d', marginHorizontal: 12 }}>
                <Text style={{ fontSize: 16, color: '#000' }}>FOLLOW US</Text>
                <TouchableOpacity style={{ paddingVertical: 10, paddingLeft: 15 }} onPress={() => Linking.openURL('https://www.facebook.com/klmfashionmall')} >
                    <Image style={{ width: 25, height: 25, }} source={require('../../asserts/social-facebook.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingVertical: 10, paddingLeft: 15 }} onPress={() => Linking.openURL('https://twitter.com/klm_fashionmall')}>
                    <Image style={{ width: 25, height: 25, }} source={require('../../asserts/socail-twitter.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingVertical: 10, paddingLeft: 15 }} onPress={() => Linking.openURL('https://www.instagram.com/klm_fashionmall')}>
                    <Image style={{ width: 25, height: 25, }} source={require('../../asserts/socail-instagram.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingVertical: 10, paddingLeft: 15 }} onPress={() => Linking.openURL('https://in.pinterest.com/klmfashionmall')}>
                    <Image style={{ width: 25, height: 25, }} source={require('../../asserts/socail-pinerest.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingVertical: 10, paddingLeft: 15 }} onPress={() => Linking.openURL('https://www.youtube.com/channel/UCXPLviBDagH30WInECFcIXg')}>
                    <Image style={{ width: 25, height: 25, }} source={require('../../asserts/icon-youtube.png')} />
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 12, justifyContent: 'space-between' }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('FreeDelivery')}
                    style={{ backgroundColor: '#eee', width: w / 3.3, height: h / 10, justifyContent: 'center', alignItems: 'center', elevation: 2 }}>
                    <Image style={{ width: 30, height: 30, }} source={require('../../asserts/red-free-delivery.png')} />
                    <Text style={{ color: '#000', fontSize: 12, paddingTop: 8 }}>FREE DELIVERY</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('EasyReturns')} style={{ backgroundColor: '#eee', width: w / 3.3, height: h / 10, justifyContent: 'center', alignItems: 'center', elevation: 2 }}>
                    <Image style={{ width: 30, height: 30, }} source={require('../../asserts/Red-Easy-Returns.png')} />
                    <Text style={{ color: '#000', fontSize: 12, paddingTop: 8 }}>EASY RETURNS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SecurePayment')} style={{ backgroundColor: '#eee', width: w / 3.3, height: h / 10, justifyContent: 'center', alignItems: 'center', elevation: 2 }}>
                    <Image style={{ width: 30, height: 30, }} source={require('../../asserts/Secure-Payment.png')} />
                    <Text style={{ color: '#000', fontSize: 12, paddingTop: 8 }}>SECURE PAYMENT</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginHorizontal: 12, justifyContent: 'space-between', marginTop: 6.5 }}>
                <TouchableOpacity onPress={() => { Linking.openURL('tel:+91-626 218 9189'); }} style={{ backgroundColor: '#eee', width: w / 3.3, height: h / 10, justifyContent: 'center', alignItems: 'center', elevation: 2 }}>
                    <Image style={{ width: 30, height: 30, }} source={require('../../asserts/red-support-icon.png')} />
                    <Text style={{ color: '#000', fontSize: 12, paddingTop: 8 }} >+91-626 218 9189</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('mailto:hello@iloveklm.com')} style={{ backgroundColor: '#eee', width: w / 3.3, height: h / 10, justifyContent: 'center', alignItems: 'center', elevation: 2 }}>
                    <Image style={{ width: 30, height: 30, }} source={require('../../asserts/red-mail-icon.png')} />
                    <Text style={{ color: '#000', fontSize: 12, paddingTop: 8 }}>hello@iloveklm.com</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { Linking.openURL('https://api.whatsapp.com/send?phone=916262189189&text=Hello,KLM'); }} style={{ backgroundColor: '#eee', width: w / 3.3, height: h / 10, justifyContent: 'center', alignItems: 'center', elevation: 2 }}>
                    <Image style={{ width: 30, height: 30, }} source={require('../../asserts/whatsup.png')} />
                    <Text style={{ color: '#000', fontSize: 12, paddingTop: 8 }}>+91-626 218 9189</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 15, flexDirection: 'row', paddingHorizontal: 12, backgroundColor: '#fff', elevation: 5, paddingVertical: 10 }}>
                <FlatList
                    data={pagetitles}
                    numColumns={2}
                    renderItem={({ item, index }) => (
                        <View style={{ width: w / 2.2 }}>
                            <Text style={{ color: '#000', fontWeight: 'bold', paddingTop: 10, fontSize: 16 }}>{item.PageTitle.toUpperCase()}</Text>
                            <FlatList
                                data={pagetitles[index].Childs}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => navFottorPages(item)}  >
                                        <Text style={{ color: '#a2a4a8', fontWeight: '500', paddingTop: 10, fontSize: 14 }}>{item.PageTitle}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                />
            </View>
            <View style={{ marginTop: 25, backgroundColor: '#000' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                    <Text style={{ color: '#fff', paddingHorizontal: 12 }}>We Accept</Text>
                    <Image style={{ height: 25 }} source={require('../../asserts/weaccept.png')} />
                </View>
                <TouchableOpacity
                    testID={'btnnavrevalsys'} onPress={() => Linking.openURL('https://www.revalsys.com')}
                    style={{ alignItems: 'center', paddingTop: 4 }}>
                    <Image style={{ height: 25, width: 25 }} source={require('../../asserts/revalsys.png')} />
                </TouchableOpacity>
                <Text style={{ fontSize: 14, color: '#888888', marginHorizontal: 20, paddingVertical: 15, textAlign: 'center' }}>Copyright © {copyRight - 1} - {copyRight} <Text style={{ color: '#ff5353' }}>www.iloveklm.com.</Text> All Right Reserved.</Text>

            </View>
        </View>
    )
}
export default Footer;

const styles = StyleSheet.create({
    ProvideView: { flexDirection: 'row', padding: 15, alignItems: 'center' },
    ProvideText: { fontSize: 16, paddingLeft: 20 },
    SubscribeImg: { height: 78, width: 72 },
    SubscribeTxt: { fontSize: 38, fontFamily: 'PinyonScript', color: '#fff', textAlign: 'center', top: -15 },
    socialM: { paddingHorizontal: 10 },
})


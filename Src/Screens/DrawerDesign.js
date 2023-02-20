// @Vigneshwari Murugan 
// Side Menu page 
// copyrights @Revalsys Technologies


import React, { useEffect, useState } from 'react';
import { View, Platform, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Text, ImageBackground, Image, ToastAndroid, Linking } from 'react-native';
// import { Avatar, Caption, Title, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../Helper/helperModule';
import { getGlobalVarsF, setGlobalVarsF } from '../Helper/loginhelper';
import Path from '../Helper/Api';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

export default function DrawerContent(props) {
    const [istokenavailable, setIstokenavailable] = useState(false);
    const [loder, setLoader] = useState(true);
    const [showAccount, setShowAccount] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        checkToken();
        setGlobalVarsF({ showSignOutF: checkToken });
    }, []);

    const checkToken = async () => {
        let customerToken = await AsyncStorage.getItem('CustomerToken');
        if (customerToken) {
            setIstokenavailable(true)
        }
        else {
            setIstokenavailable(false)
        }

    }
    const wishList = () => {
        if (istokenavailable == true) {
            props.navigation.navigate('WishlistPage')
        } else {
            props.navigation.navigate('Loginwithotp', { pagefrom: 'Home' })
        }
    }
    const profile = () => {
        if (istokenavailable == true) {
            props.navigation.navigate('Profile')
        } else {
            props.navigation.navigate('Loginwithotp', { pagefrom: 'Home' })
        }
    }
    const order = () => {
        if (istokenavailable == true) {
            props.navigation.navigate('Orders')
        } else {
            props.navigation.navigate('Loginwithotp', { pagefrom: 'Home' })
        }
    }
    const myAddress = () => {
        if (istokenavailable == true) {
            props.navigation.navigate('MyAddress')
        } else {
            props.navigation.navigate('Loginwithotp', { pagefrom: 'Home' })
        }
    }

    const onLogout = async () => {
        let intcurrencyId = await AsyncStorage.getItem('CurrencyId');
        var keys = await AsyncStorage.getAllKeys();
        const params = {
            "CurrencyId": 1,
            "CustomerToken": await AsyncStorage.getItem('CustomerToken'),
        }

        api.postData(Path.logout, params).then((response) => {
            if (response.data == undefined &&
                response.data == null &&
                response.data == '') {
            } else {
                //alert(response.data.ReturnMessage);
                AsyncStorage.multiRemove(keys);
                // AsyncStorage.setItem('CurrencyId', intcurrencyId);
                setResponseMessage(response.data.ReturnMessage);

                AsyncStorage.setItem('CartCount', JSON.stringify(0));
                props.navigation.navigate('Splash');
                setLoader(false);
                checkToken();
            }
        })
            .catch(function (error) {
                // console.log(error);
                //alert(error);
            });
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View
                testID={'btnnavmenu'}
                onPress={() => props.navigation.navigate('Menu')}
                style={styles.DrawarViewHead}>
                <Text style={styles.DrawerTextHead}>
                    Menu
                </Text>
                {istokenavailable ?
                    <TouchableOpacity
                        onPress={() => onLogout()}
                    // onPress={()=>navigation.navigate('Loginwithotp')}
                    >
                        <LinearGradient
                            style={styles.LinearStyle}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#AE000C', '#5C008B']}>
                            <Text style={styles.SiginText}>
                                SIGN OUT
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('Loginwithotp', { pagefrom: 'Home' })}
                    >
                        <LinearGradient
                            style={styles.LinearStyle}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#AE000C', '#5C008B']}>
                            <Text style={styles.SiginText}>
                                SIGN IN
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }

            </View>

            <DrawerContentScrollView>
                <Drawer.Section>

                    <TouchableOpacity
                        testID={'btnnavhome'}
                        onPress={() => props.navigation.navigate('Home')}
                        style={styles.DrawarView}>
                        <Text style={styles.DrawerText}>
                            HOME
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        testID={'btnnavoffers'}
                        onPress={() => props.navigation.navigate('Category')}
                        style={styles.DrawarView}>
                        <Text style={styles.DrawerText}>
                            SHOP BY CATEGORIES
                        </Text>
                        <Ionicons
                            name={'ios-chevron-forward-outline'}
                            size={25}
                            color={'#bbb'} />
                    </TouchableOpacity>
                    <View style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                    }}>
                        <View>
                            <TouchableOpacity
                                testID={'btnnavmyaccount'}
                                onPress={() => setShowAccount(!showAccount)}
                                style={styles.DrawarAccountView}>
                                <Text style={styles.DrawerAccountText}>
                                    MY ACCOUNT
                                </Text>
                                <View>
                                    {showAccount == false ? (
                                        <Ionicons
                                            name={'ios-chevron-forward-outline'}
                                            size={25}
                                            color={'#bbb'} />
                                    ) : (<Ionicons
                                        name={'ios-chevron-down-outline'}
                                        size={25}
                                        color={'#bbb'} />)}

                                </View>
                            </TouchableOpacity>
                        </View>
                        {showAccount == true && (
                            <View>
                                <TouchableOpacity
                                    style={styles.SubView}
                                    onPress={() => order()}
                                >
                                    <View style={{ flexDirection: 'row',alignItems:'center' }}>
                                        <Image
                                            style={{
                                                width: 25,
                                                height: 25,
                                                resizeMode: 'contain',
                                            }}
                                            source={require('../../asserts/orders.png')} />
                                        <Text
                                            style={styles.SubText}>
                                            Orders
                                        </Text>
                                    </View>
                                    {!istokenavailable ?
                                        <View>
                                            <Fontisto name={'locked'} color={'#a2a2a2'} size={16} />
                                        </View> : null
                                    }

                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.SubView} onPress={() => props.navigation.navigate('FAQ', { PageUrl: '/page/faq' })}>
                                    <View style={{ flexDirection: 'row',alignItems:'center' }}>
                                        <Image
                                            style={{
                                                width: 25,
                                                height: 25,
                                                resizeMode: 'contain',
                                            }}
                                            source={require('../../asserts/help.png')} />
                                        <Text
                                            style={styles.SubText}>
                                            Help Center
                                        </Text>
                                    </View>
                                    {!istokenavailable ?
                                        <View>
                                            <Fontisto name={'locked'} color={'#a2a2a2'} size={16} />
                                        </View> : null
                                    }
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.SubView}
                                    onPress={() => wishList()}
                                >
                                    <View style={{ flexDirection: 'row',alignItems:'center' }}>

                                        <Image
                                            style={{
                                                width: 20,
                                                height: 20,
                                                resizeMode: 'contain',
                                            }}
                                            source={require('../../asserts/heart.png')} />
                                        <Text
                                            style={[styles.SubText,{paddingLeft:5}]}>
                                            My Wishlist
                                        </Text>
                                    </View>
                                    {!istokenavailable ?
                                        <View>
                                            <Fontisto name={'locked'} color={'#a2a2a2'} size={16} />
                                        </View> : null
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.SubView}
                                    onPress={() => profile()}
                                >
                                    <View style={{ flexDirection: 'row',alignItems:'center' }}>

                                        <Image
                                            style={{
                                                width: 20,
                                                height: 20,
                                                resizeMode: 'contain',
                                            }}
                                            source={require('../../asserts/profiledetail.png')} />
                                        <Text
                                            style={[styles.SubText,{paddingLeft:5}]}>
                                            Profile Details
                                        </Text>
                                    </View>
                                    {!istokenavailable ?
                                        <View>
                                            <Fontisto name={'locked'} color={'#a2a2a2'} size={16} />
                                        </View> : null
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.SubView} onPress={() => myAddress()}>
                                    <View style={{ flexDirection: 'row',alignItems:'center' }}>

                                        <Image
                                            style={{
                                                width: 25,
                                                height: 25,
                                                resizeMode: 'contain',
                                            }}
                                            source={require('../../asserts/saveaddress.png')} />
                                        <Text style={styles.SubText}>Saved Address</Text>
                                    </View>
                                    {!istokenavailable ?
                                        <View>
                                            <Fontisto name={'locked'} color={'#a2a2a2'} size={16} />
                                        </View> : null
                                    }
                                </TouchableOpacity>
                                {istokenavailable ?
                                    <TouchableOpacity
                                        onPress={() => onLogout()}
                                        style={styles.SubView}>
                                        <View style={{ flexDirection: 'row' }}>
                                            {/* <Image style={{ width: 25, height: 25 }} source={require('../../asserts/logout.png')} /> */}
                                    <AntDesign name={'logout'} color={'#000'} size={18} style={{transform: [{ rotateY:'180deg' }]}}/>
                                    
                        
                                            <Text
                                                style={styles.SubText}>
                                                Sign Out
                                            </Text>
                                        </View>                                       
                                    </TouchableOpacity>
                                    : <></>}
                            </View>
                        )}
                    </View>
                    {istokenavailable ?
                        <TouchableOpacity
                            testID={'btnnavoffers'}
                            onPress={() => props.navigation.navigate('TrackOrder')}
                            style={styles.DrawarView}>
                            <Text style={[styles.DrawerText, { textTransform: 'uppercase' }]}>
                                Track Order
                            </Text>
                        </TouchableOpacity> : null
                    }


                    <TouchableOpacity
                        testID={'btnnavoffers'}
                        onPress={() => props.navigation.navigate('StoreLocator')}
                        style={styles.DrawarView}>
                        <Text style={styles.DrawerText}>
                            STORE LOCATOR
                        </Text>
                    </TouchableOpacity>
                    <View
                        testID={'btnnavhelp'}
                        onPress={() => props.navigation.navigate('Home')}
                        style={styles.DrawarInView}>
                        <Text style={styles.DrawerInText}>
                            NEED HELP ?
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 15,
                                paddingBottom: 10,
                            }}>
                            <TouchableOpacity onPress={() => { Linking.openURL('tel:1800 120 000 500'); }}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        resizeMode: 'contain',
                                        marginLeft: 15
                                    }}
                                    source={require('../../asserts/help-icon.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { Linking.openURL('https://api.whatsapp.com/send?phone=916262189189&text=Hello,KLM'); }}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        resizeMode: 'contain',
                                        marginLeft: 20
                                    }}
                                    source={require('../../asserts/whatsup.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Drawer.Section>
            </DrawerContentScrollView>
        </View>
    )
}


const styles = StyleSheet.create({

    DrawarView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginHorizontal: 15,
        alignItems: 'center',
    },

    DrawarInView: {

        margin: 15,
        paddingBottom: 10

    },

    DrawarAccountView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,
        alignItems: 'center'
    },

    DrawerInText: {
        fontSize: 14,
        color: '#262626',

        fontWeight: "bold",
        paddingVertical: 12
    },

    DrawerText: {
        fontSize: 14,
        color: '#262626',

        fontWeight: "bold",
        paddingVertical: 16

    },

    DrawerTextHead: {
        fontSize: 22,
        color: '#262626',
        paddingBottom: 16,

        fontWeight: "bold"
    },
    DrawerAccountText: {
        fontSize: 14,
        color: '#262626',

        fontWeight: "bold"
    },
    DrawarViewHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderBottomColor: '#262626',
        margin: 15,
    },

    LinearStyle: {
        borderColor: '#0000',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5
    },

    SiginText: {
        color: '#FFFFFF',
        fontSize: 13,

        fontWeight: 'normal',
        paddingVertical: 7,
        paddingHorizontal: 25,
    },

    SubText: {
        color: '#495d62',
        fontSize: 14,

        fontWeight: 'bold',
        marginLeft: 10,
        textAlignVertical: 'center'
    },
    // SubNav: {  },
    SubView: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        paddingTop: 15,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e1d6bc',
        marginHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    socialM: { paddingHorizontal: 10 },
})

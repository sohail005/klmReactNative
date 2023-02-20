import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, View, Image, StyleSheet, TouchableOpacity, Text, Platform, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCartGlobalVarsF, setCartGlobalVarsF } from '../Helper/cartcounthelper';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const Bottomtaballpages = ({ navigation, count, wish }) => {


    const [Count, setCount] = useState(0)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            CartCountF();

            setCartGlobalVarsF({ showCartCountF: CartCountF });

        });
        return () => unsubscribe;

    }, [CartCountF]);
    const CartCountF = async () => {
        var cartCount = await AsyncStorage.getItem('CartCount');
        setCount(cartCount == null ? 0 : cartCount);
    }

    const checkToken = async () => {
        let CustomerToken = await AsyncStorage.getItem('CustomerToken');
        let IsExistingCustomer = await AsyncStorage.getItem('IsExistingCustomer');
        if (CustomerToken == '' || CustomerToken == null) {
            navigation.navigate('Loginwithotp', { pagefrom: 'MyAccount' })
        }
        else {
            navigation.navigate('MyAccount')
        }
        if (IsExistingCustomer == 'False') {
            setExisting(false);
        }
    }

    return (
        <>
            <View style={{ flex: 1, height: 60, backgroundColor: '#fff', bottom: 0, position: 'absolute', width: w, justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Home')}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('../../asserts/Home.png')}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                            />
                        </View>
                        <Text numberOfLines={1} style={{ color: '#262626', fontSize: 12, textAlign: 'center', paddingTop: 2 }}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Category')}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('../../asserts/Categories.png')}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                            />
                        </View>
                        <Text numberOfLines={1} style={{ color: '#262626', fontSize: 12, textAlign: 'center', paddingTop: 2 }}>Categories</Text>

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Offers')}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('../../asserts/BundleOffers.png')}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                            />
                        </View>
                        <Text numberOfLines={1} style={{ color: '#262626', fontSize: 12, textAlign: 'center', paddingTop: 2 }}>Bundle Offers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            // console.log('pressed')
                            checkToken()
                        }
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('../../asserts/MyAccount.png')}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                }}
                            />
                        </View>
                        <Text numberOfLines={1} style={{ color: '#262626', fontSize: 12, textAlign: 'center', paddingTop: 2 }}>My Account</Text>
                    </TouchableOpacity>

                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                        <TouchableOpacity onPress={() => navigation.push('Cart', { wish: 'wish' })}
                            testID={'btnnavcart'} style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image source={require('../../asserts/Cart.png')} resizeMode="contain"
                                style={{ width: 24, height: 24, }} />
                            <View style={{ height: 18, width: 18, backgroundColor: '#e82f40', borderRadius: 10, justifyContent: 'center', alignItems: 'center', right: 12, bottom: 4 }}>
                                <Text style={{ color: '#fff', fontSize: Count > 9 ? 10 : 12 }}>{count}</Text>
                            </View>

                        </TouchableOpacity>
                        <Text numberOfLines={1} style={{ color: '#262626', fontSize: 12, paddingTop: 2 }}>Cart</Text>
                    </View>
                </View>
            </View>
        </>
    );

}
export default Bottomtaballpages;
const styles = StyleSheet.create({
    logo: { height: 32, width: 32, marginLeft: 10 },
    LeftIcons: { justifyContent: 'center', flex: 0.12 },
    LeftIconsearch: { position: 'absolute', right: 5, top: 5, paddingVertical: 10, paddingHorizontal: 10 },
    InputStyle: { backgroundColor: '#fff', marginTop: 5, fontSize: 16, paddingVertical: Platform.OS == 'ios' ? 15 : 9, paddingHorizontal: 10, color: '#000', },
})
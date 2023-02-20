import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, View, Image, StyleSheet, TouchableOpacity, Text, Platform, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;
const keyData = [
    { id: 0, imageUrl: "https://imgKLM01.revalweb.com/MegaMenu/offer-image.png", title: "OFFERS" },
    { id: 1, imageUrl: "https://imgKLM01.revalweb.com/MegaMenu/men.png", title: "MEN" },
    { id: 2, imageUrl: "https://imgKLM01.revalweb.com/MegaMenu/women.png", title: "WOMEN" },
    { id: 3, imageUrl: "https://imgKLM01.revalweb.com/MegaMenu/boy.png", title: "KIDS" },
]
const HomeHeader = ({ navigation, cart }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [Count, setCount] = useState(0)
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            CartCountF();
            setShowSearch(false);
        });
        return () => unsubscribe;

    }, []);
    const CartCountF = async () => {
        var cartCount = await AsyncStorage.getItem('CartCount');
        setCount(cartCount == null ? 0 : cartCount);
    }


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            removeText();
        });
        return () => unsubscribe;
    }, []);
    const removeText = () => {
        setSearch([])
    }
    const getSearchApi = () => {
        if (search != '') {
            navigation.navigate('SearchListPage', { search: search });
        }
    }

    const getWishlist = async () => {

        let customerToken = await AsyncStorage.getItem('CustomerToken');

        if (customerToken == null || customerToken == '') {
            navigation.navigate('Loginwithotp', { pagefrom: 'WishlistPage' });

        } else {
            navigation.push('WishlistPage');

        }
    }

    return (
        <>
            <View style={{ backgroundColor: '#fff', flexDirection: 'row' }}>
                <TouchableOpacity
                    testID={'btnopenDrawer'} onPress={() => navigation.openDrawer()} style={{ paddingHorizontal: 10, paddingVertical: 14 }}>
                    <MaterialCommunityIcons name={'equal'} size={32} color='#000' />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center', flex: cart != 'Cart' ? 0.9 : 0.8 }}>
                    <TouchableOpacity
                        style={{ width: 80 }}
                        testID={'btnnavhome'} onPress={() => navigation.navigate('Home')}>
                        <Image
                            source={require('../../asserts/logo-svg.png')} resizeMode={'contain'}
                            style={{ width: 70, height: 42 }} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => setShowSearch(!showSearch)}
                    testID={'btnnavsearch'} style={styles.LeftIcons}>
                    <Icon name={'ios-search-outline'} size={26} color='#000' />
                </TouchableOpacity>
                <TouchableOpacity
                    testID={'btnnavwishlist'} style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => getWishlist()}>
                    <FontAwesome name={'heart-o'} size={24} color='#000' />
                </TouchableOpacity>
                    <View style={{ justifyContent: 'center', marginLeft: 10 }}>                        
                    </View>
            </View>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#AE000C', '#5C008B']}>
                <View style={{ height: 5 }}></View>
            </LinearGradient>
            <View>
                {showSearch == true && (
                    <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingBottom: 5, alignItems: 'center', borderWidth: 1, borderColor: '#000', margin: 10, borderRadius: 10 }}>
                        <TouchableOpacity
                            style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
                            <TextInput
                                testID={'txtsearch'}
                                style={styles.InputStyle}
                                placeholder={'What are you looking for?'}
                                placeholderTextColor={'gray'}
                                value={search}
                                autoFocus={true}
                                onChangeText={text => { setSearch(text); }}
                            />
                            <TouchableOpacity
                                testID={'btnnavsearch'} onPress={() => getSearchApi()} style={styles.LeftIconsearch}>
                                <Icon name={'ios-search-outline'} size={28} color='#000' />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

        </>
    );

}
export default HomeHeader;
const styles = StyleSheet.create({
    logo: { height: 32, width: 32, marginLeft: 10 },
    LeftIcons: { justifyContent: 'center', flex: 0.12 },
    LeftIconsearch: { position: 'absolute', right: 5, top: 5, paddingVertical: 10, paddingHorizontal: 10 },
    InputStyle: { backgroundColor: '#fff', marginTop: 5, fontSize: 16, paddingVertical: Platform.OS == 'ios' ? 15 : 9, paddingHorizontal: 10, color: '#000', },
})
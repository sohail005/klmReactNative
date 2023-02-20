import React, { useState, useEffect } from 'react';
import { ActivityIndicator, ScrollView, View, Platform, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';
import HomeHeader from '../CommonDesign/HomeHeader';
import HeaderCate from '../CommonDesign/HeaderCate';
import Footer from '../CommonDesign/Footer';
import axios from 'axios';
import Path from '../Helper/Api';
import Bottomtaballpages from '../CommonDesign/Bottomtaballpages';
import { getCartGlobalVarsF, setCartGlobalVarsF } from '../Helper/cartcounthelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const Kids = ({ navigation, count }) => {
    useEffect(() => { KidsPageData(); }, []);
    const [loader, setLoader] = useState(false);
    const [kidsData, setKidsData] = useState([]);
    const [Count, setCount] = useState(0);

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
    const lastlevelnav = (url, name) => {
        // item.MenuLinkURL.substring(1)
        let cat = url;
        var catName = cat.split("/");
        navigation.push('ProductList', {
            cat1: catName[2],
            cat2: catName[3],
            cat3: catName[4] == undefined ? "" : catName[4],
            catName: 'manyavar' + url,
        });
    }
    const KidsPageData = () => {
        setLoader(true)
        axios.get(Path.homePageData)
            .then(function (response) {
                setKidsData(response.data.KidsPage);
                setLoader(false)
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    return (
        <View style={{ flex: 1, backgroundColor: '#ccc' }}>
            <HomeHeader navigation={navigation} />
            <ScrollView style={{ flex: 1 }}>
                <HeaderCate navigation={navigation} />
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 12, marginTop: 15, marginBottom: 50 }}>
                    <Text style={{ fontSize: 20, fontWeight: '500', color: '#000', paddingTop: 30 }}>KIDS CATEGORIES</Text>
                    {loader == true ? (
                        <View style={{ alignItems: 'center', justifyContent: 'center', height: h / 2 }}>
                            <ActivityIndicator size="large" color="#900C19" />
                        </View>
                    ) : (
                        <FlatList
                            data={kidsData}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <View>
                                    <TouchableOpacity
                                        onPress={() => lastlevelnav(item.Url)}
                                        testID={'btnnavlist'} style={{ paddingVertical: 8, alignItems: 'center', flex: 1, paddingHorizontal: 10 }}>
                                        <Image style={{ width: w / 2.4, height: h / 3.3, resizeMode: 'cover' }} source={{ uri: item.imageUrl }} />
                                        <View style={{ backgroundColor: 'rgba(255,255,255,0.6)', position: 'absolute', width: '100%', bottom: 30 }}>
                                            <Text style={{ textAlign: 'center', paddingVertical: 10, color: '#000', fontSize: 15, fontWeight: '700', paddingHorizontal: 10 }}>{item.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                            ListFooterComponent={() => (
                                <View style={{ borderWidth: 1.2, margin: 16, borderColor: '#ff5353', opacity: 0.4 }}></View>
                            )}
                            keyExtractor={(Item, index) => index.toString()} />
                    )}
                </View>
                <View style={{ backgroundColor: '#fff', paddingTop: 12 }}>
                    <Footer navigation={navigation} />
                </View>
            </ScrollView>
            <View style={{ bottom: 0 }}>
                <Bottomtaballpages navigation={navigation} count={Count} />
            </View>
        </View>
    )
}
export default Kids;
const styles = StyleSheet.create({
    container: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, opacity: 0.7, backgroundColor: "black", justifyContent: "center", alignItems: "center", },
})

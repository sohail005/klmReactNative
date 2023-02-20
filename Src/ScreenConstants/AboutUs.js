import React, { useEffect, useState } from 'react'
import { View, FlatList, Image, StyleSheet, ActivityIndicator, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import Footer from '../CommonDesign/Footer';
import api from '../Helper/helperModule';
import WebView from 'react-native-webview';
import HeaderCate from '../CommonDesign/HeaderCate';
import HomeHeader from '../CommonDesign/HomeHeader';
import HTMLView from 'react-native-htmlview';
import Ionicons from 'react-native-vector-icons/Ionicons';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;
const Data = {
    "images": [
        { "id": 1, "imageUrl": "https://klm.revalweb.com/assets/images/banner-mobile-2.png" },
        { "id": 2, "imageUrl": "https://klm.revalweb.com/assets/images/banner-mobile-1.png" },
        { "id": 3, "imageUrl": "https://klm.revalweb.com/assets/images/banner-mobile-3.png" },
        { "id": 4, "imageUrl": "https://klm.revalweb.com/assets/images/banner-mobile-4.png" }
    ],
    "header": "BEST SHOPPING MALL IN HYDERABAD, BENGALURU & ANDHRA PRADESH",
    "contant": "KLM Fashion Mall is an iconic brand and the best family fashion shopping mall in Hyderabad, Bangalore, and Andhra Pradesh - that offers resplendent men's wear, women's wear, and kids wear at unimaginable prices along with uncountable offers. The humongous and incredible collection at all of our showrooms' is exclusively handpicked to meet the needs and requirements of our local customers. We are always stocked up with an exuberant in-vogue collection of latest and trendy ethnic wear, fusion wear, party wear, festive wear, occasion wear, wedding wear and modern wear for men, women, and kids at best prices, that go well with any occasion and also make you the icon of attraction. Shop for the best-in-class fashion, classy, latest, and trendy ensembles at our showrooms to celebrate everyday fashion. Visit your nearest KLM Fashion Mall showroom to get your hands on the best picks and avail the most happening offers now.",
    "listData": [
        { "id": 1, "iconUrl": require("../../asserts/product-icon.png"), "sumofSomething": "45", "something": "Million +", "heading": "Products for women, men and kids." },
        { "id": 1, "iconUrl": require("../../asserts/retail-store-icon.png"), "sumofSomething": "6", "something": "Lakhs + sq.ft", "heading": "of retail space dedicated to value fashion." },
        { "id": 1, "iconUrl": require("../../asserts/storebag-icon.png"), "sumofSomething": "46", "something": "Stores", "heading": "spread across over 40 cities in India." },
        { "id": 1, "iconUrl": require("../../asserts/employee-icon.png"), "sumofSomething": "6000+", "something": "Employees", "heading": "helping us deliver real value to our customers." }
    ]
}
const AboutUs = ({ navigation, route }) => {
    const [pageContent, setPageContent] = useState(null);
    const [loader, setLoader] = useState(false);
    // useEffect(() => {
    //     //getStaticPage()
    // }, [])
    // const getStaticPage = () => {
    //     setLoader(true);        

    // }
    if (loader == true) {
        return (
            <View style={{ flex: 1 }}>
                <HomeHeader navigation={navigation} />
                <ActivityIndicator style={{ alignSelf: 'center', flex: 1 }} size="large" color="#900C19" />
            </View>
        )
    } else {
        return (
            <View style={{ flex: 1 }}>
                <HomeHeader navigation={navigation} />
                <ScrollView>
                    <HeaderCate navigation={navigation} />
                    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ justifyContent: 'center' }}>
                                <Ionicons name={'arrow-back'} color={'#000'} size={26} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 16, color: '#000', fontWeight: '700', paddingLeft: 10 }}>About Us</Text>
                        </View>
                        <Text style={{ fontSize: 14, color: '#262626', paddingLeft: 25, paddingVertical: 20 }}>India's home for trends and style</Text>
                        <View style={{ paddingLeft: 25 }}>
                            <FlatList
                                data={Data.images}
                                numColumns={2}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ paddingBottom: 10, paddingLeft: (index % 2 == 0) ? 0 : 10 }}>
                                            <Image style={{ height: 140, width: 140 }} source={{ uri: item.imageUrl }} />
                                        </View>
                                    )
                                }}
                            />
                            <Text style={{ fontSize: 14, color: '#262626', paddingTop: 10, fontWeight: '500' }}>{Data.header}</Text>
                            <Text style={{ fontSize: 14, color: '#262626', paddingTop: 8, marginRight: 25 }}>{Data.contant}</Text>
                        </View>
                        <View style={{
                            marginHorizontal: 20, marginVertical: 30, paddingVertical: 40, paddingHorizontal: 15, backgroundColor: '#fff', shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            elevation: 2,
                        }}>
                            <FlatList
                                data={Data.listData}
                                numColumns={2}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ borderBottomWidth: (index == 0 || index == 1) ? 1.5 : 0, borderBottomColor: '#ccc', flex: 1 }}>
                                            <View style={{ paddingLeft: (index % 2 == 0) ? 0 : 8, borderLeftWidth: (index % 2 == 0) ? 0 : 1.5, borderLeftColor: '#ccc', paddingVertical: 10, marginVertical: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Image style={{ height: 37, width: 37 }} source={item.iconUrl} />
                                                    <View>
                                                        <Text style={{ fontSize: 20, fontWeight: '700', padding: 6, paddingLeft: 10, color: '#000' }}>{item.sumofSomething}</Text>
                                                        <Text style={{ fontSize: 10, paddingLeft: 10, color: '#6b6b6b' }}>{item.something}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{ fontSize: 13, color: '#262626', paddingTop: 10 }}>{item.heading}</Text>
                                            </View>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Footer navigation={navigation} />
                    </View>
                </ScrollView>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    p: { fontSize: 16, fontWeight: '700', color: '#000', }
})
export default AboutUs

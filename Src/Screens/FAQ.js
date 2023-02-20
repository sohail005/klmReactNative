import React, { useEffect, useState } from 'react';
import { Text, LayoutAnimation, ScrollView, Dimensions, StyleSheet, View, SafeAreaView, Modal, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import Path from '../Helper/Api';

import Icon from 'react-native-vector-icons/Ionicons';
// import Path from '../Constants/Api';
import api from '../Helper/helperModule';
import HeaderCate from '../CommonDesign/HeaderCate';
import HomeHeader from '../CommonDesign/HomeHeader';
import faq from '../faq.json';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Footer from '../CommonDesign/Footer';

const w = Dimensions.get('screen').width
const h = Dimensions.get('screen').height

const FAQ = ({ navigation }) => {

    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [mainidx, setMainidx] = useState(0);
    const [secondidx, setSecondidx] = useState(0);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        setLoader(true);
        const unsubscribe = navigation.addListener('focus', () => {
            if (faq != '' && faq != undefined && faq != null) {
                setData(faq.Maindata)
                console.log('data-----', faq)
            }
            if (data) {
                setLoader(false)
            }
        });
        return () => unsubscribe;


    }, [])

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
                    <ScrollView style={{ flex: 1 }}>
                        <HeaderCate navigation={navigation} />
                    </ScrollView>
                    <View style={{ flex: 1 }}>
                        <Text style={{marginTop:20, padding: 10, color: '#000', fontSize: 18, letterSpacing: 0, fontWeight: Platform.OS == 'ios' ? '700' : 'bold' }}> FAQ</Text>
                    </View>
                    {data.length !== 0 && (
                        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
                            <FlatList
                                data={data}
                                columnWrapperStyle={{ justifyContent: 'space-between', }}
                                numColumns={2}
                                keyExtractor={(item, index) => index}
                                renderItem={({ item, index }) => (
                                    <View style={{ width: w / 2 }}>
                                        <TouchableOpacity
                                            onPress={() => { setMainidx(index), setSecondidx(0) }}
                                            style={{ paddingVertical: 10 }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View
                                                    //style={[styles.imgview, { borderColor: mainidx === index ? '#e82f40' : '#ccc' }]}
                                                    style={{ marginRight: 5 }}
                                                >
                                                    {/* <FontAwesome5 name={item.imgUrl} size={30} color={mainidx === index?'#e82f40':'#ccc'}/> */}
                                                    {mainidx == index ?
                                                        <Image
                                                            //source={{uri:item.imgUrl_active}}
                                                            source={{ uri: Path.faqimg + item.imgUrl_active }}
                                                            style={{ height: 60, width: 60, }}
                                                            resizeMode='stretch'
                                                        />
                                                        :
                                                        <Image
                                                            source={{ uri: Path.faqimg + item.imgUrl }}
                                                            style={{ height: 60, width: 60, }}
                                                            resizeMode='stretch'
                                                        />
                                                    }
                                                </View>
                                                <Text style={styles.title}>{item.title}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                         {/*    <View>
                                <Text style={{ marginTop: 48, marginBottom: 16, fontSize: 22, fontWeight: '500', color: '#262626' }}>
                                    Frequently Asked Questions
                                </Text>
                            </View> */}
                            <View style={{ marginTop: 20 }}>
                                <View style={{ width: w }}>
                                    <FlatList
                                        data={data[mainidx].subdata}
                                        keyExtractor={(item, index) => index}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                onPress={() => { setSecondidx(index) }}
                                            >
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }}>
                                                    <View style={{ flex: 0.9 }}>
                                                        <Text style={styles.quetxt}>{item.Que}</Text>
                                                    </View>
                                                    <View style={{ flex: 0.1 }}
                                                    >
                                                        {secondidx == index ?
                                                            <AntDesign name={'down'} size={20} color={'#000'} />
                                                            :
                                                            <AntDesign name={'right'} size={20} color={'#000'} />
                                                        }
                                                    </View>
                                                </View>
                                                {secondidx === index ?
                                                    <Text style={styles.anstxt}>{item.Ans}</Text>
                                                    : null}
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                    <View style={{ marginTop: 10 }}>
                        <Footer navigation={navigation} />
                    </View>
                </ScrollView>
            </View>

        )
    }
}
export default FAQ

const styles = StyleSheet.create({
    imgview: {
        height: 70,
        width: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#ccc',
        marginRight: 8
    },
    title: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 13,
        width: w / 4
    },
    quetxt: {
        fontSize: 14,
        color: '#272727',
        fontWeight: '700',
        paddingTop: 15,
        paddingBottom: 10,

    },
    anstxt: {
        fontSize: 12,
        color: '#000',
        paddingHorizontal: 16,
        marginBottom: 10
    }
})
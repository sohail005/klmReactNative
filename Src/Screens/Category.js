import React, { useEffect, useState } from 'react';
import { Text, LayoutAnimation, ScrollView, Dimensions, StyleSheet, View, SafeAreaView, Modal, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import Path from '../Helper/Api';

import Icon from 'react-native-vector-icons/Ionicons';
// import Path from '../Constants/Api';
import api from '../Helper/helperModule';


const w = Dimensions.get('screen').width
const h = Dimensions.get('screen').height

const Category = ({ navigation }) => {
    const [Data, setData] = useState({});

    const [selectId, setSelectId] = useState(2);
    const [selectName, setSelectName] = useState('Men');
    const [currentIndex, setCurrentIndex] = useState(1);
    const [selectSecondId, setSelectSecondId] = useState(7);
    const [selectSecondName, setSelectSecondName] = useState('Shop By Style');
    const [currentSecondIndex, setCurrentSecondIndex] = useState('0');
    const [currentThiredIndex, setCurrentThiredIndex] = useState('');
    const [selectThiredId, setSelectThiredId] = useState(0);
    const [selectThiredName, setSelectThiredName] = useState('');
    const [cat1, setCat1] = useState('men');
    const [loader, setLoader] = useState(false);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [thiredCat, setThiredCat] = useState(false);
    const [secondCat, setSecondCat] = useState(false);
    const [firstLevel, setFirstLevel] = useState(true);
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getData();
        });
        return () => unsubscribe;

    }, []);
    const getData = () => {
        setLoader(true);
        api.postData(Path.getmenulink, {}).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data != undefined &&
                    response.data != null &&
                    response.data != ''
                ) {
                    if (
                        response.data.Data != undefined &&
                        response.data.Data != null &&
                        response.data.Data != ''
                    ) {
                        var cateData = response.data.Data;
                        setData(getcat(cateData));
                        setLoader(false);
                    }
                }
            }
        });

    }
    const getcat = (cateData) => {
        let main = {}
        let tempObj = {}
        cateData.map((ele, i) => {
            if (!main[ele.ParentMenuLinkId]) {
                main[ele.ParentMenuLinkId] = {}
                main[ele.ParentMenuLinkId][ele.MenuLinkId] = ele
            } else {
                main[ele.ParentMenuLinkId][ele.MenuLinkId] = ele
            }
        })

        Object.keys(main).map((ele) => {
            Object.keys(main[ele]).map(ele1 => tempObj[ele1] = ele)
        })

        let sorttemp = Object.keys(tempObj).sort((a, b) => b - a)
        sorttemp.map((ele) => {
            if (main[tempObj[ele]]) {
                main[tempObj[ele]][ele].subCat = main[ele]
                if (main[tempObj[ele]][ele].subCat1) {
                    main[tempObj[ele]][ele].subCat1.push(main[ele])
                } else {
                    main[tempObj[ele]][ele].subCat1 = main[ele] ? Object.values(main[ele]) : main[ele]
                }
                if (Number(tempObj[ele])) {
                }
            }

        })

        return Object.values(main[0]);
    }
    const SelectedEvent = (name, index) => {
        if (index == 0) {
            navigation.navigate('Offers')
        } else {
            if (name !== 'itemSelected') return;
            setSelectId(Data[index].MenuLinkId);
            setSelectName(Data[index].MenuName);
            setCat1(Data[index].MenuLinkURL);
            index === currentIndex ? null : setCurrentIndex(index);
        }
    }
    const secondLevel = (item, index) => {
        setSelectSecondId(item.MenuLinkId);
        setSelectSecondName(item.MenuName);
        index == currentSecondIndex ? null : setCurrentSecondIndex(index);
        if (index == currentSecondIndex) {
            setShowSubMenu(!showSubMenu);
        } else {
            setShowSubMenu(true);
        }
    }
    const ThiredLevel = (item, index) => {
        setSelectThiredName(item.MenuName);
        setSelectThiredId(item.MenuLinkId);
        index === currentThiredIndex ? null : setCurrentThiredIndex(index);
        if (index == currentThiredIndex) {
            setThiredCat(!thiredCat);
        } else {
            setThiredCat(true);
        }

    }
    const lastlevelnav = (url, name) => {
        // item.MenuLinkURL.substring(1)
        let cat = url.toLowerCase();
        var catName = cat.split("/");
        navigation.push('ProductList', {
            cat1: catName[2] == undefined ? "" : catName[2],
            cat2: catName[3] == undefined ? "" : catName[3],
            cat3: catName[4] == undefined ? "" : catName[4],
            catName: 'manyavar' + url,
        });
    }
    if (loader == true) {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#bbb' }}>
                    <TouchableOpacity
                        testID={'btnback'} onPress={() => navigation.goBack()}>
                        <Icon style={{ padding: 10 }} name={'ios-chevron-back'} size={30} color={'#999'} />
                    </TouchableOpacity>
                </View>
                <ActivityIndicator style={{ alignSelf: 'center', flex: 1 }} size="large" color="#900C19" />
            </View>
        )
    } else {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#bbb', flexDirection: 'row' }}>
                    <TouchableOpacity
                        testID={'btnback'} onPress={() => navigation.goBack()}>
                        <Icon style={{ padding: 10 }} name={'ios-chevron-back'} size={30} color={'#999'} />
                    </TouchableOpacity>
                    <Text style={{ paddingTop: 15, fontSize: 16, color: '#000', fontWeight: 'bold' }}>CATEGORIES</Text>
                </View>
                <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#bbb' }}>
                    <FlatList
                        data={Data}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
                                    <TouchableOpacity
                                        testID={'btnselectcategory'} onPress={() => SelectedEvent('itemSelected', index)} style={styles.MainCatTouch}>
                                        <View style={{ borderWidth: 2, borderColor: selectId === item.MenuLinkId ? '#ff5353' : '#aaa', borderRadius: 100, height: 84, width: 84 }}>
                                            <View style={{ borderWidth: 5, borderColor: '#fff', borderRadius: 100, overflow: 'hidden', height: 80, width: 80 }}>
                                                <Image style={{ height: 70, width: 70 }}
                                                    source={{ uri:item.ImageURL }}
                                                />
                                            </View>

                                        </View>
                                        <Text style={{ fontFamily: 'Roboto', paddingVertical: 8, color: selectId === item.MenuLinkId ? '#f2c452' : '#000', textAlign: 'center',textTransform:'uppercase' }}>{item.MenuName}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        )}
                        keyExtractor={(Item, index) => index.toString()} />
                </View>

                <ScrollView style={{ backgroundColor: '#fff' }}>

                    <FlatList
                        data={Data}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <View style={{ flex: 1 }}>
                                {index == currentIndex &&
                                    (<FlatList
                                        data={item.subCat1}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({ item, index }) => (
                                            <View style={{ flex: 1, width: w, marginVertical: 0 }} >
                                                <View
                                                    testID={'btnselectcategory'} style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd', marginHorizontal: 15, paddingVertical: 15 }}


                                                >
                                                    <TouchableOpacity>
                                                        <Text onPress={() => lastlevelnav(item.MenuLinkURL, item.MenuName)} style={{ fontFamily: 'Roboto', fontSize: 15, color: '#000',textTransform:'uppercase' }}>{item.MenuName}</Text>
                                                    </TouchableOpacity>
                                                    {index == currentSecondIndex && (
                                                        <TouchableOpacity>
                                                            <Icon onPress={() => { secondLevel(item, index) }} color={'#000'} name={showSubMenu == true ? 'ios-chevron-up' : 'ios-chevron-down'} size={20} />
                                                        </TouchableOpacity>
                                                    )}
                                                    {index != currentSecondIndex && (
                                                        <TouchableOpacity>
                                                            <Icon onPress={() => { secondLevel(item, index) }} color={'#000'} name={'ios-chevron-down'} size={20} />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>

                                                {
                                                    index == currentSecondIndex && showSubMenu == true &&
                                                    <FlatList
                                                        data={item.subCat1}
                                                        horizontal
                                                        showsHorizontalScrollIndicator={false}
                                                        renderItem={({ item, index }) => (

                                                            <View>
                                                                {
                                                                    item.subCat1 == undefined ? (
                                                                        <TouchableOpacity
                                                                            testID={'btnnavlist'} onPress={() => lastlevelnav(item.MenuLinkURL, item.MenuName)} style={{ paddingLeft: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ddd', width: w }} >

                                                                            <Text style={{ fontFamily: 'Roboto', fontSize: 15,color:'gray' }}>{item.MenuName}</Text>

                                                                        </TouchableOpacity>
                                                                    ) : (
                                                                        <View>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingRight: 18, paddingVertical: 15, width: w, borderBottomWidth: 1, borderBottomColor: '#ddd' }} >
                                                                                <TouchableOpacity
                                                                                    testID={'btnnavlist'} onPress={() => lastlevelnav(item.MenuLinkURL, item.MenuName)}>
                                                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 15,color:'gray' }}>{item.MenuName}</Text>

                                                                                </TouchableOpacity>
                                                                                <TouchableOpacity
                                                                                    testID={'btnselectcategory'} onPress={() => ThiredLevel(item, index)}>
                                                                                    {index == currentThiredIndex && (
                                                                                        <Icon name={thiredCat == true ? 'ios-chevron-up' : 'ios-chevron-down'} size={20} />

                                                                                    )}
                                                                                    {index != currentThiredIndex && (
                                                                                        <Icon name={'ios-chevron-down'} size={20} />

                                                                                    )}
                                                                                </TouchableOpacity>

                                                                            </View>
                                                                            {thiredCat == true && index == currentThiredIndex &&
                                                                                (
                                                                                    <FlatList
                                                                                        data={item.subCat1}
                                                                                        horizontal
                                                                                        showsHorizontalScrollIndicator={false}
                                                                                        renderItem={({ item, index }) => (
                                                                                            <TouchableOpacity
                                                                                                testID={'btnnavlist'} onPress={() => lastlevelnav(item.MenuLinkURL, item.MenuName)} style={{ paddingLeft: 15, paddingVertical: 8 }}>
                                                                                                <Text style={{ fontFamily: 'Roboto', color: '#696969', fontSize: 15 }}>{item.MenuName}</Text>
                                                                                            </TouchableOpacity>
                                                                                        )}
                                                                                        keyExtractor={(Item, index) => index.toString()} />
                                                                                )
                                                                            }
                                                                        </View>
                                                                    )
                                                                }
                                                            </View>


                                                        )}
                                                        keyExtractor={(Item, index) => index.toString()} />
                                                }
                                            </View>


                                        )}
                                        keyExtractor={(Item, index) => index.toString()} />)}
                            </View>
                        )}
                        keyExtractor={(Item, index) => index.toString()} />
                </ScrollView>
            </View>
        )
    }
};
export default Category;
const styles = StyleSheet.create({
    logo: { height: 60, width: 60, marginVertical: 10 },
    LeftIcons: { justifyContent: 'center', flex: 0.15 },
    SubNameText: { width: '60%', textAlign: 'center', paddingBottom: 15, fontSize: 10 },
    SubOverView: { backgroundColor: '#fff', marginHorizontal: 10, borderRadius: 5 },
    MainCatTouch: { alignItems: 'center', flex: 1, marginLeft: 15 },
    sideBorder: { borderLeftWidth: 5, borderLeftColor: '#FF69B4', borderRadius: 5, height: '100%' },
})

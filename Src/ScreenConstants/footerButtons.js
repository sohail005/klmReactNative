import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Platform, Button, Image, SafeAreaView } from 'react-native';
import ModalDesign from './Model';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomSheet, ListItem } from 'react-native-elements';
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const Footer = (props) => {
    //console.log(props);

    const list = [
        {
            title: 'Popular', value: 'popular',
        },
        {
            title: 'Price Low to High', value: 'price-asc',
        },
        {
            title: 'Price High to Low', value: 'price-desc',
        }
    ];

    const [modal, setModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [checked, setChecked] = React.useState(list[1].value);
    const [selectedSort, setSelectedSort] = useState(props.CallbackSort);
    const [radioPromo, setRadioPromo] = useState('first');



    handleModel = (callback) => {
        setModal(callback)
    }
    handleCallback = (callback) => {
        props.parentCallback(callback);
    }
    getSortByValue = (callback) => {
        props.sortCallback(callback);
        setSelectedSort(callback);
    }

    return (

        <View style={styles.main_view_footer}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', flex: 1 }}>

                <View
                    testID={'btnmodalopen'} style={{ paddingRight: 10 }} >
                    <View style={{ justifyContent: 'center', paddingVertical: 10 }}>
                        <TouchableOpacity onPress={() => { setIsVisible(true) }} style={{ flexDirection: 'row', borderWidth: 0.5, borderRadius: 5, borderColor: '#ccc', width: w / 2.2, alignItems: 'center', justifyContent: 'center', paddingVertical: 7 }}>
                            <Image style={{ height: 15, width: 20 }} source={require('../../asserts/sorting-icon.png')} />
                            <Text style={{ color: '#000', textAlign: 'right', fontSize: 13, paddingLeft: 8, fontWeight: '700', }}>SORT BY</Text>
                        </TouchableOpacity>

                        <Modal
                            isVisible={isVisible}
                            animationIn="slideInRight"
                            animationOut="slideOutRight"
                            coverScreen={true}
                        // containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', }}
                        >
                            <SafeAreaView style={{ flex: 1 }} >
                                <TouchableOpacity onPress={() => setIsVisible(false)} activeOpacity={0.9} style={{
                                    width: w,
                                    height: h,
                                    marginLeft: -25,
                                    top: -20, alignItems: 'flex-end'
                                }}>
                                    <View style={styles.header}>
                                        <View style={{ flexDirection: 'row', borderBottomColor: '#e6d8ba', borderBottomWidth: 0.8, marginHorizontal: 25 }}>

                                            <TouchableOpacity
                                                testID={'btnmodalclose'}
                                                onPress={() => { setIsVisible(false) }}
                                                style={{ marginRight: 15, paddingVertical: 10 }}
                                            >
                                                <Image
                                                    style={{
                                                        width: 30,
                                                        height: 30,
                                                        resizeMode: 'contain',
                                                        // marginLeft: 20,
                                                        marginTop: 4
                                                    }}
                                                    source={require('../../asserts/left-arrow.png')}
                                                />
                                            </TouchableOpacity>
                                            <Text style={{ fontSize: 24, marginLeft: 10, color: '#262626', textAlign: 'center', textAlignVertical: 'center' }}>Sort By</Text>

                                        </View>

                                        {list.map((l, i) => (

                                            <TouchableOpacity onPress={() => setSelectedSort(l.value)
                                                // setIsVisible(false)
                                            }
                                                style={{ borderBottomWidth: 0.7, borderBottomColor: '#e6d8ba', marginHorizontal: 25 }}
                                            >
                                                <View style={styles.RadioView}>
                                                    <View style={{ borderWidth: 2, borderColor: selectedSort === (l.value) ? '#FF5353' : '#e6d8ba', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                                        <View style={{ backgroundColor: selectedSort === (l.value) ? '#FF5353' : '#fff', width: 10, height: 10, borderRadius: 10 }} />
                                                    </View>
                                                    <Text style={{ fontFamily: 'Roboto', fontSize: 15, color: '#262626' }}>{l.title}</Text>
                                                    {/* <RadioButton
                                                    color={'#FF5353'}
                                                    value={l.value}
                                                    status={selectedSort === (l.value) ? 'checked' : 'unchecked'}
                                                    onPress={() => setSelectedSort(l.value)

                                                        // setIsVisible(false)
                                                    }
                                                />
                                                <Text style={{  fontSize: 15, color: '#212529' }}>{l.title}</Text> */}

                                                </View>
                                            </TouchableOpacity>

                                        ))}
                                        <TouchableOpacity
                                            testID={'btnapplyfilter'}
                                            onPress={() => getSortByValue(selectedSort)} style={{ marginTop: 20 }} >
                                            <LinearGradient
                                                style={styles.LinearStyle}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                colors={['#eb4b45', '#f18210']}>
                                                <Text style={{ color: '#FFFFFF', paddingVertical: 10, textAlign: 'center', fontSize: 20, letterSpacing: 0, }}>
                                                    APPLY</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </SafeAreaView>
                        </Modal>

                    </View>
                </View>
                <TouchableOpacity
                    testID={'btnopenmodal'}
                >
                    <View style={{ flex: 0.4, justifyContent: 'center', paddingVertical: 10 }}>
                        <TouchableOpacity onPress={() => { setModal(true) }}
                            style={{ flexDirection: 'row', borderWidth: 0.5, borderRadius: 5, borderColor: '#ccc', width: w / 2.2, alignItems: 'center', justifyContent: 'center', paddingVertical: 7 }}
                        >
                            <Image style={{ height: 15, width: 15, }} source={require('../../asserts/filter-icon.png')} />
                            <Text style={{ color: '#000', textAlign: 'right', fontSize: 13, paddingLeft: 8, fontWeight: '700' }}>FILTER</Text>
                        </TouchableOpacity>


                        <Modal
                            isVisible={modal}
                            //animationType='slide'
                            animationIn="slideInRight"
                            animationOut="slideOutRight"
                            coverScreen={true}
                        >
                            <SafeAreaView style={{ flex: 1, }}>
                                <View style={{ marginTop: -30, }}>
                                    <ModalDesign {...props}
                                        data={props.data.Facets}
                                        search_data={props.search_data}
                                        onSelect={handleModel}
                                        parentCallback={handleCallback}
                                    />
                                </View>
                            </SafeAreaView>
                        </Modal>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    main_view_footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    buttons_footer: {
        // backgroundColor: '#900c19',

    },
    text_display_footer: {
        marginTop: h * 0.015,
        textAlign: 'center',
        color: '#000',
        fontWeight: 'bold',
        fontSize: 15
    },
    header: {
        width: w / 1.12,
        height: h,
        backgroundColor: '#fff',
        marginLeft: 25,
        top: -20

    },
    RadioView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14
        // paddingLeft: 15,
        // borderBottomWidth: 0.7,
        // borderBottomColor: '#e6d8ba',
        // marginHorizontal: 15
    },

    headerTxt: {
        marginLeft: w * 0.39
    },
    LinearStyle: { marginLeft: 30, borderRadius: 8, marginRight: 30 }

});
export default Footer;

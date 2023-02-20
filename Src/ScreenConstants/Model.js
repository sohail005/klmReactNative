import React, { useState, useEffect, useCallback } from 'react';
import { View, SafeAreaView, ScrollView, Text, Platform, StyleSheet, TouchableOpacity, Dimensions, FlatList, LayoutAnimation, Image, AsyncStorage } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Checkbox, List, Title } from 'react-native-paper';
import Slider from 'rn-range-slider';

import Thumb from './Slider/Thumb';
import Rail from './Slider/Rail';
import RailSelected from './Slider/RailSelected';
import CheckBox from 'react-native-check-box'
import Notch from './Slider/Notch';
import Label from './Slider/Label';
import LinearGradient from 'react-native-linear-gradient';
const w = Dimensions.get('screen').width
const h = Dimensions.get('screen').height

const ModalDesign = (props) => {
    let keyData = Object.keys(props.data);
    useEffect
    let myobj = Object.values(props.data);
    let keyData1 = [];
    for (let i = 0; i < myobj.length; i++) {
        keyData1.push(myobj[i][0].DisplayFacetName)
    }

    const [expanded, setExpanded] = useState(true);
    const [checked, setChecked] = useState(true);
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [showselectedItem, setShowSelectedItem] = useState([]);
    const [low, setLow] = useState(1);
    const [high, setHigh] = useState(100);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(100);
    const [selectName, setSelectedName] = useState('');
    const [currentSecondIndex, setCurrentSecondIndex] = useState('');
    const [ClearData, setClearData] = useState(false);
    const [currentSecondValue, setCurrentSecondValue] = useState('');
    const [heart, setHeart] = useState(false);
    const renderThumb = useCallback(() => <Thumb />, []);
    const renderRail = useCallback(() => <Rail />, []);
    const renderRailSelected = useCallback(() => <RailSelected />, []);
    const renderLabel = useCallback(value => <Label text={value} />, []);
    const renderNotch = useCallback(() => <Notch />, []);

    //  useEffect(() => { if (heart) { handlePress(input,index); setHeart(false); } }, [heart]);

    const handleValueChange = useCallback((low, high) => {
        setData(props.search_data);

        keyData.forEach((x, y) => {
            props.data[x].forEach((z) => {
                if (x == 'price') {
                    setLow(z.SelectedMinPrice);
                    setHigh(z.SelectedMaxPrice);
                } else {
                    setLow(low);
                    setHigh(high);
                }
            })
        })

        handleCheckoxprice('{price:[' + low + 'to' + high + ']}');
    }, []);
    useEffect(() => {
        filterData();
    }, []);
    const filterData = (clearFilter) => {
        if (clearFilter == 'clear') {
            setData([]);
            setClearData(true);

        } else {
            setData(props.search_data);

            keyData.forEach((x, y) => {
                props.data[x].forEach((z) => {
                    if (x == 'price') {
                        setLow(z.SelectedMinPrice);
                        setHigh(z.SelectedMaxPrice);

                    }
                    if (props.search_data.includes("{" + x + ":" + z.Title + "}")) {
                        let g = selectedItem
                        g.push("{" + x + ":" + z.Title + "}")
                        let l = showselectedItem
                        l.push(z.Title)
                    }
                })
            });
        }

    }

    const onTrigger = () => {
        props.parentCallback(selectedItem);
        props.onSelect(false);
    }

    const handleCheckoxprice = (subInput, title, flag) => {

        if (selectedItem.indexOf(subInput) === -1) {
            if (!flag) {
                var arrPrice = []
                arrPrice.push(subInput);
                var result = [arrPrice.pop()];
                // setSelectedItem();
                // setChecked(!checked);
                // selectedItem.push(result);
                //  console.log(result, 'result');
                setSelectedItem(result);
                //setShowSelectedItem(result);
                setChecked(!checked);

            }
        }
        else {

            selectedItem.splice(selectedItem.indexOf(subInput), 1);
            // console.log(selectedItem, 'result1');

            setSelectedItem(selectedItem);
            showselectedItem.splice(showselectedItem.indexOf(title), 1);
            setShowSelectedItem(showselectedItem);

            //  console.log(showselectedItem.indexOf(title), 1,);

            //setShowSelectedItem(showselectedItem);
            setChecked(!checked);
        }
        let Data = data;
        const filteredItems = Data.filter(item => item !== subInput);
        setData(filteredItems);
        //let x = data.replace(title, '');

        // console.log('orginal', d);

    }
    const handleCheckox = (subInput, title, flag) => {

        if (selectedItem.indexOf(subInput) === -1) {
            if (!flag) {
                selectedItem.push(subInput);
                // console.log('selected items ----', selectedItem);
                // setSelectedItem(selectedItem);
                showselectedItem.push(title);
                setShowSelectedItem(showselectedItem);
                // console.log('showselected item2-----', showselectedItem);
                setChecked(!checked);
                setExpanded(false);
            }
        }
        else {
            selectedItem.splice(selectedItem.indexOf(subInput), 1);
            setSelectedItem(selectedItem);
            showselectedItem.splice(showselectedItem.indexOf(subInput), 1);
            setShowSelectedItem(showselectedItem);
            setChecked(!checked);
        }
        let Data = data;
        const filteredItems = Data.filter(item => item !== subInput);
        setData(filteredItems);
        //let x = data.replace(title, '');

        // console.log('orginal', d);

    }

    const clearFilter = (item, index) => {
        selectedItem.splice(index, 1)
        showselectedItem.splice(index, 1)
        filterData('clear');
        // props.parentCallback([]);
        // props.onSelect(false);
    }
    const handlePress = async (input, index) => {

        setSelectedName(input);
        await setCurrentSecondIndex(index);
        // index == currentSecondIndex ? null : setCurrentSecondIndex(index);
        // if (index == currentSecondIndex) {
        //     setExpanded(false);
        // } 
        setExpanded(false);
        if (index == currentSecondIndex && expanded == false) {
            setExpanded(true);
            setCurrentSecondIndex(index);
        }
        // else {
        //     setExpanded(false);
        // }
    }
    const handleClose = () => {
        if (ClearData == true) {
            props.parentCallback(selectedItem);
            props.onSelect(false);
        } else {
            props.onSelect(false);

        }
    }
    return (

        <View style={{ flex: 1, }}>
            <View style={styles.main_view}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>

                        <TouchableOpacity
                            testID={'btnmodalclose'}
                            onPress={handleClose}
                        >
                            <Image
                                style={{
                                    width: 30,
                                    height: 30,
                                    resizeMode: 'contain',
                                    marginLeft: 20,
                                }}
                                source={require('../../asserts/left-arrow.png')}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontWeight: '500', fontSize: 24, marginLeft: 15, color: '#262626' }}>Filter</Text>
                    </View>
                </View>

                <ScrollView style={styles.body}>
                    {

                        keyData.map((input, index) => {
                            return (
                                <View>
                                    {currentSecondIndex == index &&

                                        (

                                            <View style={{ marginTop: 15, marginBottom: 15, marginLeft: 15 }}>
                                                <FlatList
                                                    data={showselectedItem}
                                                    numColumns={3}
                                                    renderItem={({ item, index }) => (

                                                        <View style={{
                                                            flexDirection: 'row',
                                                            borderRadius: 8,
                                                            borderWidth: 1,
                                                            borderColor: '#bbb',
                                                            marginHorizontal: 10,
                                                            marginBottom: 8
                                                        }}>
                                                            <Text style={{ paddingVertical: 5, paddingLeft: 5, width: w / 8, color: '#000' }}>
                                                                {/* width: w / 8 */}
                                                                {/* {selectedItem &&selectedItem[0] && console.log(JSON.parse(selectedItem[0]), 'selct')} */}
                                                                {item}
                                                            </Text>
                                                            <Ionicons onPress={() => clearFilter(item, index)} style={{ padding: 5 }} color='#000' name='close-circle-outline' size={18} />
                                                        </View>
                                                    )}
                                                    keyExtractor={(Item, index) => index.toString()} />

                                            </View>
                                        )
                                        // :null
                                    }
                                </View>

                            )
                        })}
                    {

                        keyData.map((input, index) => {
                            return (
                                <View key={index} style={styles.body_section}>
                                    {/* {input != 'price' ?  ( */}
                                    <View key={'level1' + index}>

                                        <TouchableOpacity
                                            //expanded={expanded}
                                            style={{ backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 15, margin: 0, flexDirection: 'row', justifyContent: 'space-between' }}
                                            onPress={() => { handlePress(input, index) }}>

                                            <>
                                                {input == 'DesignType' ? (
                                                    <Text style={{
                                                        fontSize: 14, color: '#000',
                                                        textTransform: 'uppercase',
                                                    }}>Design Type</Text>
                                                ) :
                                                    input == 'WashCare' ? (
                                                        <Text style={{
                                                            fontSize: 14, color: '#000',
                                                            textTransform: 'uppercase',
                                                        }}>Wash Care</Text>
                                                    )
                                                        :
                                                        input == 'PRODUCTFABRIC' ? (
                                                            <Text style={{
                                                                fontSize: 14, color: '#000',
                                                                textTransform: 'uppercase',
                                                            }}>PRODUCT FABRIC</Text>
                                                        )
                                                            :
                                                            input == 'Sleevelength' ? (
                                                                <Text style={{
                                                                    fontSize: 14, color: '#000',
                                                                    textTransform: 'uppercase',
                                                                }}>Sleeve length</Text>
                                                            )
                                                                :
                                                                input == 'Printorpatterntype' ? (
                                                                    <Text style={{
                                                                        fontSize: 14, color: '#000',
                                                                        textTransform: 'uppercase',
                                                                    }}>Print or pattern type</Text>
                                                                )
                                                                    :
                                                                    input == 'Bottomfabric' ? (
                                                                        <Text style={{
                                                                            fontSize: 14, color: '#000',
                                                                            textTransform: 'uppercase',
                                                                        }}>Bottom fabric</Text>
                                                                    )
                                                                        :
                                                                        (
                                                                            <Text style={{
                                                                                fontSize: 14, color: '#262626',
                                                                                textTransform: 'uppercase',
                                                                            }}>{input}</Text>
                                                                        )}
                                            </>


                                            <>
                                                {currentSecondIndex == index && (

                                                    <Entypo color='#262626' name={expanded == true ? 'chevron-right' : 'chevron-down'} size={20} />

                                                )}

                                                {currentSecondIndex != index && (

                                                    <Entypo color='#262626' name={'chevron-right'} size={20} />

                                                )}
                                            </>
                                        </TouchableOpacity>



                                        {currentSecondIndex == index && expanded == false && (
                                            <>
                                                {
                                                    props.data[input].map((subInput, subIndex) => {
                                                        return (
                                                            <View style={styles.SubListDisplay} key={'child' + subIndex}>

                                                                <>
                                                                    {input == 'price' ? (
                                                                        <View testID={"lblpricef"} style={{ width: w / 1.2 }}>
                                                                            <View style={styles.root}>
                                                                                <View testID={"lblminprice"} style={styles.horizontalContainer}>
                                                                                    <Text testID={"lblminprice"} style={styles.valueText}>{low}</Text>
                                                                                    <Text testID={"lblmaxprice"} style={styles.valueText}>{high}</Text>
                                                                                </View>
                                                                                <Slider
                                                                                    min={subInput.MinPrice}
                                                                                    max={subInput.MaxPrice}
                                                                                    step={1}
                                                                                    disableRange={false}
                                                                                    floatingLabel={false}
                                                                                    renderThumb={renderThumb}
                                                                                    renderRail={renderRail}
                                                                                    renderRailSelected={renderRailSelected}
                                                                                    onValueChanged={handleValueChange}
                                                                                />
                                                                            </View>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5, flex: 1, marginRight: 40, marginLeft: 10 }}>
                                                                                <Text testID={"lblminprice"} style={styles.valueText}>{subInput.MinPrice}</Text>
                                                                                <Text testID={"lblmaxprice"} style={styles.valueText}>{subInput.MaxPrice}</Text>
                                                                            </View>
                                                                        </View>
                                                                    ) :
                                                                        (
                                                                        <TouchableOpacity
                                                                            testID={'btnselectfilter'} onPress={() => {
                                                                                handleCheckox("{" + input + ":" + subInput.Title + "}", subInput.Title, data.includes("{" + input + ":" + subInput.Title + "}"))
                                                                            }} style={{ flexDirection: 'row', width: '100%', alignItems: 'center', paddingVertical: 5 }}>
                                                                            {/* <Checkbox
                                                                                testID={"btncheckbox"}
                                                                                uncheckedColor="#262626"
                                                                                color="#FF5353"
                                                                                status={selectedItem.includes("{" + input + ":" + subInput.Title + "}") ||
                                                                                    data.includes("{" + input + ":" + subInput.Title + "}") ? 'checked' : 'unchecked'
                                                                                }
                                                                            /> */}
                                                                            <View style={{ height: 18, width: 18, borderRadius: 2, borderWidth: 1.5, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                                                                                {selectedItem.includes("{" + input + ":" + subInput.Title + "}") ||
                                                                                    data.includes("{" + input + ":" + subInput.Title + "}") ?
                                                                                    <Entypo name={'check'} color='#fd7e14' size={20} style={{ top: -5, height: 20, width: 20, left: 3 }} />
                                                                                    : null
                                                                                }
                                                                            </View>
                                                                            <View>
                                                                                <Text style={{ fontSize: 14, color: '#262626' }}>
                                                                                    {input == 'color' ? (<View style={{ width: 11, height: 11, backgroundColor: '#' + subInput.ColorCode, borderRadius: 10 }} />) : (null)}
                                                                                    {'  '}{subInput.Title}</Text>
                                                                            </View>
                                                                        </TouchableOpacity>
                                                                        )}
                                                                </>

                                                            </View>
                                                        )
                                                    })
                                                }
                                            </>
                                        )}

                                    </View>
                                    {/* )} */}

                                </View>
                            )
                        })
                    }
                    <View style={{ padding: 30, paddingBottom: 100 }}>
                        {/* <TouchableOpacity
                            testID={'btnclearfilter'} onPress={() => clearFilter()}>
                            <Text style={{  textAlign: 'center', paddingVertical: 10, fontSize: 20,  color: '#7b6637', letterSpacing: 3 }}>CLEAR</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            testID={'btnapplyfilter'}
                            onPress={() => {
                                onTrigger();

                            }} >
                            <LinearGradient
                                style={styles.LinearStyle}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#eb4b45', '#f18210']}>
                                <Text style={{ color: '#FFFFFF', paddingVertical: 10, textAlign: 'center', fontSize: 20, letterSpacing: 0 }}>
                                    APPLY</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    main_view: {
        width: w / 1.12,
        height: h,
        backgroundColor: '#fff',
        marginLeft: 25,
    },
    header: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomColor: '#e6d8ba',
        borderBottomWidth: 1,

    },
    headerTxt: {
        marginLeft: w * 0.39
    },
    body:
    {
        flex: 5,
        paddingHorizontal: 10,
    },
    body_section: {
        borderBottomWidth: 1,
        borderBottomColor: "#FFFFFF",
        marginHorizontal: 15
    },
    accord_header: {
        marginLeft: w * 0.03,
        fontSize: w * 0.055,
        fontWeight: '700',

    },

    footer_btn: {
        width: w * 1,
        backgroundColor: '#900c19',

    },
    checkboxContainer: {
        flexDirection: 'row',
    },
    LinearStyle: {
        borderColor: '#0000',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 5
    },
    root: {
        alignItems: 'stretch',
        paddingHorizontal: 12,
        flex: 1,
        marginRight: 10,
        width: '90%'
    },
    horizontalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 5,
        flex: 1,

    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    valueText: {
        color: '#55637d',
        fontSize: 18,

    },
})

export default ModalDesign;


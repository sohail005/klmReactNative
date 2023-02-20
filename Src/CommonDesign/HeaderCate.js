import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, View, Image, StyleSheet, TouchableOpacity, Text, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;
const keyData = [
    { id: 0, imageUrl: "https://imgKLM01.revalweb.com/uploads/megamenu/offer-image1636219391.jpg", title: "OFFERS", Url: 'Offers' },
    { id: 1, imageUrl: "https://imgKLM01.revalweb.com/uploads/megamenu/men1636219380.jpg", title: "MEN", Url: 'Men' },
    { id: 2, imageUrl: "https://imgKLM01.revalweb.com/uploads/megamenu/women1636219356.jpg", title: "WOMEN", Url: 'Women' },
    { id: 3, imageUrl: "https://imgKLM01.revalweb.com/uploads/megamenu/boy1636219366.jpg", title: "KIDS", Url: 'Kids' },
]
const HeaderCate = ({ navigation }) => {
    const lastlevelnav = (url) => {        
        navigation.navigate(url);
    }
    return (
        <View>            
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#AE000C', '#5C008B']}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    {
                        keyData.map((input, index) => {
                            return (
                                <TouchableOpacity onPress={()=> lastlevelnav(input.Url)} style={{ paddingTop: 10 }}>
                                    <View style={{  justifyContent: 'center', alignItems: 'center', }}>
                                        <Image resizeMode={'contain'} style={{ height: 65, width: 65 }} source={{ uri: input.imageUrl }} />
                                    </View>
                                    <Text style={{  color: '#fff', padding: 10, textAlign: 'center', fontWeight:'700' }}>{input.title}</Text>
                                </TouchableOpacity>
                            )
                        })}
                </View>
            </LinearGradient>
        </View>
    );
}
export default HeaderCate;
const styles = StyleSheet.create({
    logo: { height: 32, width: 32, marginLeft: 10 },
    LeftIcons: { justifyContent: 'center', flex: 0.12 },

})
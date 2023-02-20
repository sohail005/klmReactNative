import React, { useEffect, useState, } from 'react';
import { ActivityIndicator, ScrollView, View, Platform, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Dimensions } from 'react-native';
import HomeHeader from '../CommonDesign/HomeHeader';
import HeaderCate from '../CommonDesign/HeaderCate';
import MainSlider from './MainSlider';

const w = Dimensions.get('screen').width
const HomeScreen = (props) => {

 
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
     <HomeHeader navigation={props.navigation} cart={'Cart'} />
             
        <MainSlider navigation={props.navigation} />
      
    </View>
  );
};
export default HomeScreen;

import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import Footer from '../CommonDesign/Footer';
import api from '../Helper/helperModule';
import WebView from 'react-native-webview';
import HeaderCate from '../CommonDesign/HeaderCate';
import HomeHeader from '../CommonDesign/HomeHeader';
import HTMLView from 'react-native-htmlview';
import Ionicons from 'react-native-vector-icons/Ionicons';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const ContentPages = ({ navigation, route }) => {
    const [pageContent, setPageContent] = useState('');
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        getStaticPage()
    }, [])
    const getStaticPage = () => {
        setLoader(true);
        var Request = {            
            CurrencyId: "1",
            CustomerToken: "",
            PageURL: route.params.PageUrl

        }
        api.postData('/api/Page', Request).then((response) => {
            if (response != undefined && response != null) {
                if (
                    response.data.Data != undefined &&
                    response.data.Data != null &&
                    response.data.Data != null

                ) {
                    setPageContent(response.data.Data.PageContent);
                    setLoader(false);
                }

            }
        });

    }
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
                <HeaderCate navigation={navigation} />
                <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 15, paddingTop: 15 }}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ justifyContent: 'center'}}>
                        <Ionicons name={'arrow-back'} color={'#000'} size={26} />
                    </TouchableOpacity>
                    <Text style={{fontSize:16,color:'#000',fontWeight:'700',paddingLeft:10}}>{route.params.Title}</Text>
                    </View>                    
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: pageContent }}
                        setBuiltInZoomControls={false}
                        textZoom={250}
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    p: { fontSize: 16, fontWeight: '700', color: '#000', }
})
export default ContentPages

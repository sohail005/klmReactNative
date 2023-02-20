import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Text, Image, ScrollView,Dimensions } from 'react-native'
import Footer from '../CommonDesign/Footer';
import api from '../Helper/helperModule';
import WebView from 'react-native-webview';
import HeaderCate from '../CommonDesign/HeaderCate';
import HomeHeader from '../CommonDesign/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

const FreeDelivery = ({ navigation }) => {
    const [pageContent, setPageContent] = useState(null);
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        getStaticPage()
    }, [])
    const getStaticPage = async () => {
        setLoader(true);
        let CustomerToken = await AsyncStorage.getItem('CustomerToken');
        var Request = {
            //CustomerToken: "",
            //PageURL: "/page/return-policy",
            CurrencyId: "1",
            CustomerToken: CustomerToken,
           // PageURL: "socialLinks,contact-us,manufacture-details,no-search-results,site-records"
            PageURL:'/page/free-delivery'
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
                <ScrollView>
                    <ScrollView style={{ flex: 1 }}>
                        <HeaderCate navigation={navigation} />
                    </ScrollView>  
                {/* <View style={{ backgroundColor: '#fff', paddingTop: 15 }}>
                  
                </View> */}
                <View style={{flex:1,marginTop:20,padding:10}}>
                <WebView 
                // source={{uri:'https://imgklm01.revalweb.com/homepagetemplates/mobile/html/free%20delivery1640108650.html'}}
                //  //source={{ uri: URL.Pri }}
                // style={{height:h*1.15,width:'100%',}} 
                source={{ html:pageContent }}
                style={{height:h*2,width:'100%',}} 
                scalesPageToFit={false}
                setBuiltInZoomControls={false}
                textZoom={100}
                />
                

                </View>
              
              <View style={{marginTop:0,marginBottom:0 }}>
                        <Footer navigation={navigation} />
                    </View>  
            </ScrollView> 
            </View>
        )
    }
}
const styles = StyleSheet.create({
    breadC: { color: '#a0998a', fontSize: 15,  paddingHorizontal: 2 },

})
export default FreeDelivery

import React, { Component } from 'react';
import { SafeAreaView, Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import DrawerContent from '../Screens/DrawerDesign';
import Splash from '../Screens/Splash';
import BottomTab from './BottomTab';
import ProductList from '../Screens/ProductList';
import PDP from '../Screens/PDP';
import Men from '../Screens/Men';
import Women from '../Screens/Women';
import Kids from '../Screens/Kids';
import SearchListPage from '../Screens/SearchListPage';
import LoginScreen from '../Screens/LoginScreen';
import Loginwithotp from '../Screens/Loginwithotp';
import RegisterScreen from '../Screens/RegisterScreen';
import ForgotPassword from '../Screens/ForgotPassword';
import Checkout from '../Screens/Checkout';
import WishlistPage from '../Screens/WishlistPage';
import Cart from '../Screens/CartPage';
import ContactUs from '../ScreenConstants/ContactUs';
import AboutUs from '../ScreenConstants/AboutUs';
import Profile from '../Screens/Profile';
import Payment from '../Screens/Payment';
import Orders from '../Screens/Orders';
import OrderDetails from '../Screens/OrderDetails';
import MyAddress from '../Screens/MyAddress';
import ContentPages from '../ScreenConstants/ContentPages';
import TrackingResult from '../Screens/TrackingResult';
import TrackOrder from '../Screens/TrackOrder';

import StoreLocator from '../Screens/StoreLocator';
import MyAccount from '../Screens/MyAccount';

import ReturnPolicy from '../Screens/ReturnPolicy';
import ShippingPolicy from '../Screens/ShippingPolicy';
import TandC from '../Screens/TandC';
import FreeDelivery from '../Screens/FreeDelivery';

import ThankYou from '../Screens/ThankYou';
import AppleLogin from '../Screens/AppleLogin';
import EasyReturns from '../Screens/EasyReturns';
import SecurePayment from '../Screens/SecurePayment';
// import AppleLogin from '../Screens/AppleLogin';
import Home from '../Screens/Home';

import Offers from '../Screens/Offers';
import Category from '../Screens/Category';
import SignupWithOTP from '../Screens/SignupWithOTP';
import FAQ from '../Screens/FAQ'


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const w = Dimensions.get('screen').width;
const h = Dimensions.get('screen').height;

export const MainStackNavigator = () => {
    return (
        <>
            {/* screenOptions={({ route, navigation }) => ({ headerShown: false })} */}
            <Stack.Navigator initialRouteName='Splash' screenOptions={
                ({ route, navigation }) => ({
                    headerShown: false,
                    gestureEnabled: false,
                    gestureDirection: 'horizontal',
                    ...TransitionPresets.SlideFromRightIOS
                })
            }
            >
                
                <Stack.Screen name='Splash' component={Splash} ></Stack.Screen>
                <Stack.Screen name="BottomTab" component={BottomTab} ></Stack.Screen>
                <Stack.Screen name="LoginScreen" component={LoginScreen}></Stack.Screen>
                <Stack.Screen name='Loginwithotp' component={Loginwithotp} ></Stack.Screen>
                <Stack.Screen name='SignupWithOTP' component={SignupWithOTP} ></Stack.Screen>
                <Stack.Screen name='ForgotPassword' component={ForgotPassword} ></Stack.Screen>
                <Stack.Screen name='RegisterScreen' component={RegisterScreen} ></Stack.Screen>
                <Stack.Screen name='ProductList' component={ProductList} ></Stack.Screen>
                <Stack.Screen name='PDP' component={PDP} ></Stack.Screen>
                <Stack.Screen name='Men' component={Men} ></Stack.Screen>
                <Stack.Screen name='Women' component={Women} ></Stack.Screen>
                <Stack.Screen name='Kids' component={Kids} ></Stack.Screen>
                <Stack.Screen name='SearchListPage' component={SearchListPage} ></Stack.Screen>
                <Stack.Screen name='ContactUs' component={ContactUs}></Stack.Screen>
                <Stack.Screen name='AboutUs' component={AboutUs}></Stack.Screen>
                <Stack.Screen name='Checkout' component={Checkout} ></Stack.Screen>
                <Stack.Screen name='WishlistPage' component={WishlistPage} ></Stack.Screen>
                <Stack.Screen name='Payment' component={Payment} ></Stack.Screen>
                <Stack.Screen name='Profile' component={Profile} ></Stack.Screen>
                <Stack.Screen name='Orders' component={Orders} ></Stack.Screen>
                <Stack.Screen name='OrderDetails' component={OrderDetails} ></Stack.Screen>
                <Stack.Screen name='MyAddress' component={MyAddress} ></Stack.Screen>
                <Stack.Screen name='ContentPages' component={ContentPages}></Stack.Screen>
                <Stack.Screen name='TrackOrder' component={TrackOrder} ></Stack.Screen>
                <Stack.Screen name='TrackingResult' component={TrackingResult} ></Stack.Screen>
                <Stack.Screen name='ThankYou' component={ThankYou} ></Stack.Screen>
                <Stack.Screen name='StoreLocator' component={StoreLocator} ></Stack.Screen>
               
                <Stack.Screen name='ReturnPolicy' component={ReturnPolicy}></Stack.Screen>
                <Stack.Screen name='ShippingPolicy' component={ShippingPolicy}></Stack.Screen>
                <Stack.Screen name='TandC' component={TandC}></Stack.Screen>
                <Stack.Screen name='FreeDelivery' component={FreeDelivery}></Stack.Screen>
                {/* <Stack.Screen name='AppleLogin' component={AppleLogin}></Stack.Screen> */}
                <Stack.Screen name='EasyReturns' component={EasyReturns}></Stack.Screen>
                <Stack.Screen name='SecurePayment' component={SecurePayment}></Stack.Screen>
                <Stack.Screen name='Cart' component={Cart} ></Stack.Screen>
                <Stack.Screen name='FAQ' component={FAQ} ></Stack.Screen>
            </Stack.Navigator>
        </>
    );
}

// export const CategoryStack = ({ route, navigation }) => {
//     return (
//         <Stack.Navigator headerMode={"Category"} screenOptions={
//             ({ route, navigation }) => ({
//                 headerShown: false,
//                 gestureEnabled: false,
//                 gestureDirection: 'horizontal',
//                 ...TransitionPresets.SlideFromRightIOS
//             })
//         }
//         >
//             {/* <Stack.Screen name='Home' component={Home} ></Stack.Screen>
//                 <Stack.Screen name="BottomTab" component={BottomTab} ></Stack.Screen> */}


//             <Stack.Screen name="Category" component={Category} ></Stack.Screen>
//             <Stack.Screen name='Men' component={Men} ></Stack.Screen>
//             <Stack.Screen name='Women' component={Women} ></Stack.Screen>
//             <Stack.Screen name='Kids' component={Kids} ></Stack.Screen>
//             <Stack.Screen name='ProductList' component={ProductList} ></Stack.Screen>
//             <Stack.Screen name='PDP' component={PDP} ></Stack.Screen>
//             {/* <Stack.Screen name='SearchListPage' component={SearchListPage} ></Stack.Screen> */}

//             {/* <Stack.Screen name='Cart' component={Cart} ></Stack.Screen>
               
//                 <Stack.Screen name='Checkout' component={Checkout} ></Stack.Screen>
//                 <Stack.Screen name='WishlistPage' component={WishlistPage} ></Stack.Screen>
//                 <Stack.Screen name='Payment' component={Payment} ></Stack.Screen>
//                 <Stack.Screen name='Profile' component={Profile} ></Stack.Screen>
//                 <Stack.Screen name='Orders' component={Orders} ></Stack.Screen>
//                 <Stack.Screen name='OrderDetails' component={OrderDetails} ></Stack.Screen>
//                 <Stack.Screen name='MyAddress' component={MyAddress} ></Stack.Screen>
               
//                 <Stack.Screen name='TrackOrder' component={TrackOrder} ></Stack.Screen>
//                 <Stack.Screen name='TrackingResult' component={TrackingResult} ></Stack.Screen>
//                 <Stack.Screen name='ThankYou' component={ThankYou} ></Stack.Screen>
//                 <Stack.Screen name='StoreLocator' component={StoreLocator} ></Stack.Screen> */}
//             {/* <Stack.Screen name='AboutUs' component={AboutUs}></Stack.Screen>
//                 <Stack.Screen name='ReturnPolicy' component={ReturnPolicy}></Stack.Screen>
//                 <Stack.Screen name='ShippingPolicy' component={ShippingPolicy}></Stack.Screen>
//                 <Stack.Screen name='TandC' component={TandC}></Stack.Screen>
//                 <Stack.Screen name='FreeDelivery' component={FreeDelivery}></Stack.Screen> */}
//             {/* <Stack.Screen name='AppleLogin' component={AppleLogin}></Stack.Screen> */}
//             {/* <Stack.Screen name='EasyReturns' component={EasyReturns}></Stack.Screen>
//                 <Stack.Screen name='SecurePayment' component={SecurePayment}></Stack.Screen> */}

//         </Stack.Navigator>
//     );
// }

// export const CartStack = ({ route, navigation }) => {
//     return (
//         <Stack.Navigator initialRouteName="Cart" screenOptions={
//             ({ route, navigation }) => ({
//                 headerShown: false,
//                 gestureEnabled: false,
//                 gestureDirection: 'horizontal',
//                 ...TransitionPresets.SlideFromRightIOS
//             })
//         }
//         >
   
//             <Stack.Screen name='Cart' component={Cart} ></Stack.Screen>
//             <Stack.Screen name='Checkout' component={Checkout} ></Stack.Screen>


//         </Stack.Navigator>
//     );
// }

// export const HomeStack = ({ route, navigation }) => {
//     return (
//         <Stack.Navigator initialRouteName='Home' screenOptions={
//             ({ route, navigation }) => ({
//                 headerShown: false,
//                 gestureEnabled: false,
//                 gestureDirection: 'horizontal',
//                 ...TransitionPresets.SlideFromRightIOS
//             })
//         }
//         >
//                 <Stack.Screen name='Home' component={Home} ></Stack.Screen>                
//                 <Stack.Screen name='ProductList' component={ProductList} ></Stack.Screen>
//                 <Stack.Screen name='PDP' component={PDP} ></Stack.Screen>
//                 <Stack.Screen name='Men' component={Men} ></Stack.Screen>
//                 <Stack.Screen name='Women' component={Women} ></Stack.Screen>
//                 <Stack.Screen name='Kids' component={Kids} ></Stack.Screen>
//                 <Stack.Screen name='SearchListPage' component={SearchListPage} ></Stack.Screen>
//                 <Stack.Screen name='ContactUs' component={ContactUs}></Stack.Screen>
//                 <Stack.Screen name='Checkout' component={Checkout} ></Stack.Screen>
//                 <Stack.Screen name='WishlistPage' component={WishlistPage} ></Stack.Screen>
//                 <Stack.Screen name='Payment' component={Payment} ></Stack.Screen>
//                 <Stack.Screen name='Profile' component={Profile} ></Stack.Screen>
//                 <Stack.Screen name='Orders' component={Orders} ></Stack.Screen>
//                 <Stack.Screen name='OrderDetails' component={OrderDetails} ></Stack.Screen>
//                 <Stack.Screen name='MyAddress' component={MyAddress} ></Stack.Screen>
//                 <Stack.Screen name='ContentPages' component={ContentPages}></Stack.Screen>
//                 <Stack.Screen name='TrackOrder' component={TrackOrder} ></Stack.Screen>
//                 <Stack.Screen name='TrackingResult' component={TrackingResult} ></Stack.Screen>
//                 <Stack.Screen name='ThankYou' component={ThankYou} ></Stack.Screen>
//                 <Stack.Screen name='StoreLocator' component={StoreLocator} ></Stack.Screen>
//                 <Stack.Screen name='AboutUs' component={AboutUs}></Stack.Screen>
//                 <Stack.Screen name='ReturnPolicy' component={ReturnPolicy}></Stack.Screen>
//                 <Stack.Screen name='ShippingPolicy' component={ShippingPolicy}></Stack.Screen>
//                 <Stack.Screen name='TandC' component={TandC}></Stack.Screen>
//                 <Stack.Screen name='FreeDelivery' component={FreeDelivery}></Stack.Screen>
//                 {/* <Stack.Screen name='AppleLogin' component={AppleLogin}></Stack.Screen> */}
//                 <Stack.Screen name='EasyReturns' component={EasyReturns}></Stack.Screen>
//                 <Stack.Screen name='SecurePayment' component={SecurePayment}></Stack.Screen>
                
//             </Stack.Navigator>
        
//     );
// }


class DrawerNavigator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Drawer.Navigator
                    screenOptions={({ route, navigation }) => ({ headerShown: false })}
                    drawerContent={props => <DrawerContent {...props} />}>
                    <Drawer.Screen name="BottomTab" component={MainStackNavigator} />
                </Drawer.Navigator>
            </SafeAreaView>
        )
    }
}

export default DrawerNavigator;